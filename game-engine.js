class SkyParkourEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.isAdmin = options.isAdmin || false;
    this.onBlockClick = options.onBlockClick || null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.blocks = [];
    this.clouds = [];
    this.playerMeshes = {};
    this.myPlayerId = null;

    this.TOTAL_BLOCKS = 14;
    this.BLOCK_WIDTH = 13;
    this.BLOCK_HEIGHT = 1.6;
    this.BLOCK_DEPTH = 5.2;
    this.STEP_Z = -7.5;
    this.STEP_Y = 1.45;

    this.adminFocusBlock = 0;

    this.slotOffsets = this.generate40Slots();

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  generate40Slots() {
    const slots = [];
    const cols = 10;
    const rows = 4;
    const marginX = 1.1;
    const marginZ = 0.85;
    const usableW = this.BLOCK_WIDTH - marginX * 2;
    const usableD = this.BLOCK_DEPTH - marginZ * 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -usableW / 2 + (c / (cols - 1)) * usableW;
        const z = -usableD / 2 + (r / (rows - 1)) * usableD;
        slots.push({ x, z });
      }
    }
    return slots;
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = this.createSkyTexture();
    this.scene.fog = new THREE.FogExp2(0xbfe6ff, 0.0045);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);

    if (this.isAdmin) {
      this.camera.position.set(0, 10.5, 13.5);
      this.camera.lookAt(0, 3.5, -18);
    } else {
      this.camera.position.set(0, 7, 11);
      this.camera.lookAt(0, 2, -6);
    }

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.62);
    dirLight.position.set(18, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 200;
    const d = 60;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    this.createBlocks();
    this.createClouds();

    window.addEventListener("resize", () => this.onResize());
    if (this.isAdmin && this.onBlockClick) {
      this.renderer.domElement.addEventListener("pointerdown", (e) => this.handlePointerDown(e));
    }

    this.animate();
  }

  createSkyTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, "#68b5f8");
    grad.addColorStop(0.45, "#9fd4fc");
    grad.addColorStop(0.85, "#d8f0ff");
    grad.addColorStop(1.0, "#eef8ff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 512);
    return new THREE.CanvasTexture(canvas);
  }

  getBlockCenter(index) {
    return new THREE.Vector3(0, index * this.STEP_Y, index * this.STEP_Z);
  }

  createBlocks() {
    for (let i = 0; i < this.TOTAL_BLOCKS; i++) {
      const pos = this.getBlockCenter(i);
      const geo = new THREE.BoxGeometry(this.BLOCK_WIDTH, this.BLOCK_HEIGHT, this.BLOCK_DEPTH);

      let colorHex = 0xf7f8fa;
      if (i === 0) colorHex = 0xeef6ff;
      if (i === this.TOTAL_BLOCKS - 1) colorHex = 0xfff8dc;

      const mat = new THREE.MeshLambertMaterial({ color: colorHex });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.userData = { blockIndex: i };

      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xd5dce6, transparent: true, opacity: 0.75 })
      );
      mesh.add(line);

      const badge = this.createBlockBadge(i);
      badge.position.set(-this.BLOCK_WIDTH / 2 + 1.3, this.BLOCK_HEIGHT / 2 + 0.03, this.BLOCK_DEPTH / 2 - 0.55);
      badge.rotation.x = -Math.PI / 2;
      mesh.add(badge);

      this.scene.add(mesh);
      this.blocks.push(mesh);
    }
  }

  createBlockBadge(index) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = index === 0 ? "#2563eb" : index === 13 ? "#d97706" : "#64748b";
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 56, 14);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let label = `BLOK ${index}`;
    if (index === 0) label = "BAŞLANGIÇ";
    else if (index === 13) label = "BİTİŞ";

    ctx.fillText(label, 128, 33);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const geo = new THREE.PlaneGeometry(2.2, 0.55);
    return new THREE.Mesh(geo, mat);
  }

  createClouds() {
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92
    });

    const cloudPositions = [
      [-16, 4, -8], [17, 6, -14], [-22, 11, -35], [20, 13, -45],
      [-18, 18, -68], [22, 20, -78], [-15, 24, -102], [19, 25, -110],
      [-28, 2, -20], [28, 8, -30], [-25, 16, -88], [26, 22, -95]
    ];

    cloudPositions.forEach(([cx, cy, cz], idx) => {
      const group = new THREE.Group();
      const puffs = 4 + (idx % 3);
      for (let p = 0; p < puffs; p++) {
        const radius = 2.2 + ((idx + p) % 3) * 0.9;
        const geo = new THREE.SphereGeometry(radius, 16, 16);
        const puff = new THREE.Mesh(geo, cloudMat);
        puff.position.set((p - puffs / 2) * 2.1, (p % 2) * 0.7, ((p * 2) % 3 - 1) * 1.1);
        puff.scale.set(1.25, 0.75, 0.95);
        group.add(puff);
      }
      group.position.set(cx, cy, cz);
      this.scene.add(group);
      this.clouds.push({ group, baseX: cx, speed: 0.18 + (idx % 4) * 0.05, phase: idx });
    });
  }

  handlePointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.blocks, false);
    if (intersects.length > 0) {
      const clickedBlockIndex = intersects[0].object.userData.blockIndex;
      this.setAdminFocusBlock(clickedBlockIndex);
      if (this.onBlockClick) {
        this.onBlockClick(clickedBlockIndex);
      }
    }
  }

  setAdminFocusBlock(blockIndex) {
    this.adminFocusBlock = Math.max(0, Math.min(this.TOTAL_BLOCKS - 1, blockIndex));
    this.blocks.forEach((b, idx) => {
      if (idx === this.adminFocusBlock && idx > 0 && idx < 13) {
        b.material.color.setHex(0xe0f2fe);
      } else if (idx === 0) {
        b.material.color.setHex(0xeef6ff);
      } else if (idx === 13) {
        b.material.color.setHex(0xfff8dc);
      } else {
        b.material.color.setHex(0xf7f8fa);
      }
    });
  }

  getColorHex(colorName) {
    switch (colorName) {
      case "kirmizi": return 0xef4444;
      case "mavi": return 0x3b82f6;
      case "yesil": return 0x22c55e;
      default: return 0x3b82f6;
    }
  }

  createNameSprite(fullName, colorName) {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 72;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 300, 52, 26);
    ctx.fill();

    ctx.fillStyle = colorName === "kirmizi" ? "#ef4444" : colorName === "yesil" ? "#22c55e" : "#3b82f6";
    ctx.beginPath();
    ctx.arc(38, 36, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 23px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const displayText = fullName.length > 16 ? fullName.slice(0, 15) + "…" : fullName;
    ctx.fillText(displayText, 60, 37);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.8, 0.63, 1);
    return sprite;
  }

  getSlotWorldPosition(blockIndex, slotIndex) {
    const safeBlock = Math.max(0, Math.min(this.TOTAL_BLOCKS - 1, blockIndex));
    const safeSlot = ((slotIndex % 40) + 40) % 40;
    const center = this.getBlockCenter(safeBlock);
    const offset = this.slotOffsets[safeSlot];
    return new THREE.Vector3(
      center.x + offset.x,
      center.y + this.BLOCK_HEIGHT / 2 + 0.48,
      center.z + offset.z
    );
  }

  // Bot oyuncu yoktur; yalnızca sisteme kayıtlı gerçek oyuncular sahnede çizilir
  syncPlayers(playersMap, myPlayerId = null) {
    if (myPlayerId) this.myPlayerId = myPlayerId;
    const activeIds = new Set(Object.keys(playersMap || {}));

    Object.keys(this.playerMeshes).forEach((id) => {
      if (!activeIds.has(id)) {
        this.scene.remove(this.playerMeshes[id].group);
        delete this.playerMeshes[id];
      }
    });

    activeIds.forEach((id) => {
      const p = playersMap[id];
      if (!p) return;

      let entry = this.playerMeshes[id];
      if (!entry) {
        const group = new THREE.Group();
        const ballGeo = new THREE.SphereGeometry(0.48, 28, 28);
        const ballMat = new THREE.MeshStandardMaterial({
          color: this.getColorHex(p.color),
          roughness: 0.28,
          metalness: 0.08
        });
        const sphere = new THREE.Mesh(ballGeo, ballMat);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        group.add(sphere);

        const label = this.createNameSprite(`${p.name} ${p.surname}`, p.color);
        label.position.set(0, 1.05, 0);
        group.add(label);

        const startPos = this.getSlotWorldPosition(p.block || 0, p.slot || 0);
        group.position.copy(startPos);
        this.scene.add(group);

        entry = {
          group,
          sphere,
          label,
          currentBlock: p.block || 0,
          slotIndex: p.slot || 0,
          basePos: startPos.clone(),
          bouncePhase: Math.random() * Math.PI * 2,
          lastEventId: null,
          animMode: "idle",
          animTimer: 0,
          pushTargetPos: null
        };
        this.playerMeshes[id] = entry;
      }

      const targetPos = this.getSlotWorldPosition(p.block || 0, p.slot || 0);
      entry.basePos.copy(targetPos);
      entry.currentBlock = p.block || 0;
      entry.slotIndex = p.slot || 0;

      if (p.lastAction && p.lastAction.id && p.lastAction.id !== entry.lastEventId) {
        entry.lastEventId = p.lastAction.id;
        if (p.lastAction.type === "fall") {
          entry.animMode = "falling";
          entry.animTimer = 3.0;
        } else if (p.lastAction.type === "push" && p.lastAction.targetId) {
          const targetEntry = this.playerMeshes[p.lastAction.targetId];
          if (targetEntry) {
            entry.animMode = "pushing";
            entry.animTimer = 1.1;
            entry.pushTargetPos = targetEntry.basePos.clone();
          }
        }
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    this.clouds.forEach((c) => {
      c.group.position.x = c.baseX + Math.sin(elapsed * c.speed + c.phase) * 1.4;
    });

    Object.keys(this.playerMeshes).forEach((id) => {
      const entry = this.playerMeshes[id];

      // Durduğu zaman bile sürekli zıplayan top karakteri
      const bounceVal = Math.abs(Math.sin(elapsed * 5.2 + entry.bouncePhase));
      const jumpHeight = bounceVal * 0.42;
      const squash = bounceVal < 0.12 ? 0.86 : 1.0 + bounceVal * 0.08;
      const stretch = 1 / Math.sqrt(squash);
      entry.sphere.scale.set(stretch, squash, stretch);

      if (entry.animMode === "falling") {
        entry.animTimer -= dt;
        if (entry.animTimer > 0) {
          const progress = 1 - entry.animTimer / 3.0;
          const dropDepth = Math.sin(progress * Math.PI) * 7.5;
          entry.group.position.x = THREE.MathUtils.lerp(entry.group.position.x, entry.basePos.x, dt * 6);
          entry.group.position.z = THREE.MathUtils.lerp(entry.group.position.z, entry.basePos.z, dt * 6);
          entry.group.position.y = entry.basePos.y - dropDepth;
        } else {
          entry.animMode = "idle";
          entry.group.position.copy(entry.basePos);
        }
      } else if (entry.animMode === "pushing" && entry.pushTargetPos) {
        entry.animTimer -= dt;
        if (entry.animTimer > 0) {
          const p = 1 - entry.animTimer / 1.1;
          const lunge = Math.sin(p * Math.PI);
          entry.group.position.lerpVectors(entry.basePos, entry.pushTargetPos, lunge * 0.85);
          entry.group.position.y += lunge * 1.3;
        } else {
          entry.animMode = "idle";
          entry.group.position.copy(entry.basePos);
        }
      } else {
        entry.group.position.x = THREE.MathUtils.lerp(entry.group.position.x, entry.basePos.x, dt * 6);
        entry.group.position.z = THREE.MathUtils.lerp(entry.group.position.z, entry.basePos.z, dt * 6);
        const targetY = entry.basePos.y + jumpHeight;
        entry.group.position.y = THREE.MathUtils.lerp(entry.group.position.y, targetY, dt * 10);
      }
    });

    if (this.isAdmin) {
      const focusCenter = this.getBlockCenter(this.adminFocusBlock);
      const desiredCamPos = new THREE.Vector3(0, focusCenter.y + 10.5, focusCenter.z + 13.5);
      const desiredLookAt = new THREE.Vector3(0, focusCenter.y + 3.2, focusCenter.z - 16.0);
      this.camera.position.lerp(desiredCamPos, dt * 3.2);
      if (!this.currentAdminLookAt) this.currentAdminLookAt = desiredLookAt.clone();
      this.currentAdminLookAt.lerp(desiredLookAt, dt * 3.2);
      this.camera.lookAt(this.currentAdminLookAt);
    } else if (this.myPlayerId && this.playerMeshes[this.myPlayerId]) {
      const myPos = this.playerMeshes[this.myPlayerId].group.position;
      const desiredCamPos = new THREE.Vector3(myPos.x * 0.55, myPos.y + 4.4, myPos.z + 7.2);
      const desiredLookAt = new THREE.Vector3(myPos.x * 0.4, myPos.y + 0.6, myPos.z - 5.5);
      this.camera.position.lerp(desiredCamPos, dt * 5.5);
      if (!this.currentPlayerLookAt) this.currentPlayerLookAt = desiredLookAt.clone();
      this.currentPlayerLookAt.lerp(desiredLookAt, dt * 6.5);
      this.camera.lookAt(this.currentPlayerLookAt);
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
}
