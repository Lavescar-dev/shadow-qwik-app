import { $, component$, useComputed$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type * as ThreeNS from 'three';
import { AppContext } from '../../context/app-context';

type ThreeLib = typeof ThreeNS;
import { assemblyRepo } from '../../data/assembly-repo';
import {
  closeAssemblyCategory,
  compileAssemblyBuild,
  getAssemblyHudStatus,
  removeAssemblyComponent,
  selectAssemblyComponent,
  setAssemblyStatus,
  toggleAssemblyCategory,
} from '../../lib/assembly-actions';
import { isAssemblyCategoryId } from '../../lib/assembly-config';
import type { AssemblyCategoryId } from '../../lib/assembly-types';
import './assembly.css';
import { AssemblyCategoryBar } from './assembly-category-bar';
import { AssemblyFooter } from './assembly-footer';
import { AssemblyHeader } from './assembly-header';
import { AssemblyViewport } from './assembly-viewport';

type AssemblyBoxPart = {
  type: 'box';
  args: [number, number, number];
  pos: [number, number, number];
  rot?: [number, number, number];
};

type AssemblyCylinderPart = {
  type: 'cyl';
  args: [number, number, number, number];
  pos: [number, number, number];
  rot?: [number, number, number];
};

type AssemblySchematic = {
  hitbox: [number, number, number];
  hitboxPos: [number, number, number];
  parts: Array<AssemblyBoxPart | AssemblyCylinderPart>;
};

const schematics: Record<AssemblyCategoryId, AssemblySchematic> = {
  mobo: {
    hitbox: [14, 0.4, 18],
    hitboxPos: [0, 0, 0],
    parts: [
      { type: 'box', args: [14, 0.2, 18], pos: [0, 0, 0] },
      { type: 'box', args: [3, 0.3, 3], pos: [-2, 0.25, -4] },
      { type: 'box', args: [1.5, 1.2, 7], pos: [-6, 0.7, -4] },
      { type: 'box', args: [6, 1.2, 1.5], pos: [-2, 0.7, -8] },
      { type: 'box', args: [10, 0.8, 1], pos: [0, 0.5, 3] },
      { type: 'box', args: [10, 0.8, 1], pos: [0, 0.5, 6] },
      { type: 'box', args: [3, 1, 5], pos: [4, 0.6, -4] },
    ],
  },
  cpu: {
    hitbox: [3.5, 1, 3.5],
    hitboxPos: [0, 0, 0],
    parts: [
      { type: 'box', args: [2.5, 0.1, 2.5], pos: [0, 0, 0] },
      { type: 'box', args: [2.2, 0.3, 2.2], pos: [0, 0.2, 0] },
    ],
  },
  ram: {
    hitbox: [3, 4, 6],
    hitboxPos: [0, 2, 0],
    parts: [
      { type: 'box', args: [0.2, 3.5, 5.2], pos: [-0.6, 1.75, 0] },
      { type: 'box', args: [0.2, 3.5, 5.2], pos: [0.6, 1.75, 0] },
      { type: 'box', args: [0.6, 3.2, 5], pos: [-0.6, 1.8, 0] },
      { type: 'box', args: [0.6, 3.2, 5], pos: [0.6, 1.8, 0] },
    ],
  },
  gpu: {
    hitbox: [13, 6, 4],
    hitboxPos: [0, 3, 0],
    parts: [
      { type: 'box', args: [12, 4.5, 0.2], pos: [0, 2.25, 0] },
      { type: 'box', args: [11.8, 4.2, 1.5], pos: [0, 2.25, 0.85] },
      { type: 'cyl', args: [1.6, 1.6, 0.4, 16], pos: [-3.5, 2.25, 1.8], rot: [Math.PI / 2, 0, 0] },
      { type: 'cyl', args: [1.6, 1.6, 0.4, 16], pos: [3.5, 2.25, 1.8], rot: [Math.PI / 2, 0, 0] },
    ],
  },
  cooling: {
    hitbox: [5, 6, 5],
    hitboxPos: [0, 3, 0],
    parts: [
      { type: 'box', args: [2.5, 0.5, 2.5], pos: [0, 0.25, 0] },
      { type: 'box', args: [3, 4, 3.5], pos: [0, 2.5, 0] },
      { type: 'box', args: [1, 3.5, 3.5], pos: [2.1, 2.5, 0] },
      { type: 'box', args: [1, 3.5, 3.5], pos: [-2.1, 2.5, 0] },
    ],
  },
  storage: {
    hitbox: [4.5, 1, 2],
    hitboxPos: [0, 0.5, 0],
    parts: [
      { type: 'box', args: [3.5, 0.1, 1.2], pos: [0, 0.05, 0] },
      { type: 'box', args: [0.6, 0.15, 0.8], pos: [1.2, 0.175, 0] },
      { type: 'box', args: [1, 0.15, 1], pos: [-0.5, 0.175, 0] },
    ],
  },
  psu: {
    hitbox: [7, 5, 7],
    hitboxPos: [0, 2.5, 0],
    parts: [
      { type: 'box', args: [6, 4, 6], pos: [0, 2, 0] },
      { type: 'cyl', args: [2.5, 2.5, 0.2, 16], pos: [0, 4.1, 0] },
      { type: 'box', args: [2, 1, 1], pos: [-2, 1, -3] },
    ],
  },
  case_fans: {
    hitbox: [3, 11, 5],
    hitboxPos: [0, 0, 0],
    parts: [
      { type: 'box', args: [1.5, 4, 4], pos: [0, 2.5, 0] },
      { type: 'cyl', args: [1.8, 1.8, 1.6, 16], pos: [0, 2.5, 0], rot: [Math.PI / 2, 0, Math.PI / 2] },
      { type: 'box', args: [1.5, 4, 4], pos: [0, -2.5, 0] },
      { type: 'cyl', args: [1.8, 1.8, 1.6, 16], pos: [0, -2.5, 0], rot: [Math.PI / 2, 0, Math.PI / 2] },
    ],
  },
  chassis: {
    hitbox: [23, 2, 23],
    hitboxPos: [0, -7.5, 0],
    parts: [
      { type: 'box', args: [22, 0.5, 22], pos: [0, -7.25, 0] },
      { type: 'box', args: [22, 14, 0.5], pos: [0, 0, -10.75] },
    ],
  },
};

const physicalAddressing: Array<{ key: AssemblyCategoryId; x: number; y: number; z: number }> = [
  { key: 'chassis', x: 0, y: 0, z: 0 },
  { key: 'mobo', x: -2, y: -6.8, z: 0 },
  { key: 'case_fans', x: 10, y: -2, z: 0 },
  { key: 'psu', x: -6, y: -6.8, z: 7 },
  { key: 'cpu', x: -4, y: -6.45, z: -4 },
  { key: 'ram', x: 2, y: -6.4, z: -4 },
  { key: 'cooling', x: -4, y: -6.15, z: -4 },
  { key: 'gpu', x: -2, y: -6.2, z: 3 },
  { key: 'storage', x: -6, y: -6.45, z: 0 },
];

const formatUptime = (uptimeSeconds: number) => {
  const hours = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(uptimeSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const AssemblyView = component$(() => {
  const { app } = useContext(AppContext);
  const state = app.assembly;
  const containerRef = useSignal<HTMLElement>();

  const hudStatus = useComputed$(() => getAssemblyHudStatus(state));
  const uptimeLabel = useComputed$(() => formatUptime(state.uptimeSeconds));

  const onToggleCategory$ = $((categoryId: AssemblyCategoryId) => {
    toggleAssemblyCategory(state, categoryId);
  });

  const onSelectAssemblyComponent$ = $((categoryId: AssemblyCategoryId, itemId: number) => {
    selectAssemblyComponent(state, categoryId, itemId);
  });

  const onRemoveComponent$ = $((categoryId: AssemblyCategoryId) => {
    removeAssemblyComponent(state, categoryId);
  });

  const onCompile$ = $(() => {
    compileAssemblyBuild(state);
  });

  const onCanvasMouseLeave$ = $(() => {
    state.hoveredCategory = null;
  });

  useVisibleTask$(({ cleanup }) => {
    if (!containerRef.value) return;

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('#assembly-category-bar')) {
        closeAssemblyCategory(state);
      }
    };

    const uptimeInterval = window.setInterval(() => {
      state.uptimeSeconds += 1;
    }, 1000);

    document.addEventListener('click', handleDocumentClick);

    cleanup(() => {
      window.clearInterval(uptimeInterval);
      document.removeEventListener('click', handleDocumentClick);
    });
  });

  useVisibleTask$(async ({ cleanup }) => {
    if (!containerRef.value) return;

    const THREE: ThreeLib = await import('three');
    const colorUnmounted = new THREE.Color(0x333333);
    const colorMounted = new THREE.Color(0x00ffcc);
    const colorHover = new THREE.Color(0xffffff);

    const container = containerRef.value;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const hardwareGroup = new THREE.Group();
    scene.add(hardwareGroup);

    const d = 16;
    const camera = new THREE.OrthographicCamera();
    camera.position.set(25, 30, 25);
    camera.lookAt(scene.position);

    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const gridHelper = new THREE.GridHelper(40, 40, 0x1f1f1f, 0x0a0a0a);
    gridHelper.position.y = -8;
    hardwareGroup.add(gridHelper);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-2, -2);
    const raycastTargets: any[] = [];
    const hwMeshes = new Map<AssemblyCategoryId, any>();
    let hoveredKey: AssemblyCategoryId | null = null;
    let rafId = 0;

    const updateCamera = () => {
      const aspect = container.clientWidth / container.clientHeight;
      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const createCompositeNode = (key: AssemblyCategoryId, x: number, y: number, z: number) => {
      const schema = schematics[key];
      const group = new THREE.Group();

      const hitGeo = new THREE.BoxGeometry(...schema.hitbox);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(...schema.hitboxPos);
      hitMesh.userData = { key };
      group.add(hitMesh);
      raycastTargets.push(hitMesh);

      schema.parts.forEach((part) => {
        const geometry = part.type === 'box'
          ? new THREE.BoxGeometry(...(part.args as [number, number, number]))
          : new THREE.CylinderGeometry(...(part.args as [number, number, number, number]));

        const fillMat = new THREE.MeshBasicMaterial({
          color: colorUnmounted.clone(),
          transparent: true,
          opacity: 0.05,
          depthWrite: false,
        });
        const fillMesh = new THREE.Mesh(geometry, fillMat);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMat = new THREE.LineBasicMaterial({
          color: colorUnmounted.clone(),
          transparent: true,
          opacity: 0.4,
        });
        const wireframe = new THREE.LineSegments(edges, lineMat);

        fillMesh.position.set(...part.pos);
        wireframe.position.set(...part.pos);

        if (part.rot) {
          fillMesh.rotation.set(...part.rot);
          wireframe.rotation.set(...part.rot);
        }

        group.add(fillMesh);
        group.add(wireframe);
      });

      const spreadOffset = physicalAddressing.findIndex((item) => item.key === key) * 4;
      const floatingY = y + 20 + spreadOffset;
      group.position.set(x, floatingY, z);
      group.userData = { key, baseY: y, floatingY };

      hardwareGroup.add(group);
      hwMeshes.set(key, group);
    };

    physicalAddressing.forEach(({ key, x, y, z }) => {
      createCompositeNode(key, x, y, z);
    });

    const handleResize = () => updateCamera();
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleMouseLeave = () => {
      mouse.x = -2;
      mouse.y = -2;
      hoveredKey = null;
      state.hoveredCategory = null;
    };

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      let nextHover: AssemblyCategoryId | null = null;

      if (intersects.length > 0) {
        const hit = intersects.find((entry: any) => isAssemblyCategoryId(String(entry.object.userData.key)));
        if (hit) nextHover = hit.object.userData.key as AssemblyCategoryId;
      }

      if (hoveredKey !== nextHover) {
        hoveredKey = nextHover;
        state.hoveredCategory = nextHover;
      }

      hardwareGroup.rotation.y -= 0.002;

      hwMeshes.forEach((group, key) => {
        const isMounted = state.selections[key] !== null;
        const isHovered = hoveredKey === key;
        const targetY = isMounted ? group.userData.baseY : group.userData.floatingY;
        group.position.y += (targetY - group.position.y) * 0.12;

        const targetOpacityWf = isHovered ? 1 : isMounted ? 1 : 0.3;
        const targetOpacityFill = isHovered ? 0.9 : isMounted ? 0.15 : 0.02;
        const targetColor = isHovered ? colorHover : isMounted ? colorMounted : colorUnmounted;

        group.traverse((child: any) => {
          if (child instanceof THREE.LineSegments) {
            const material = child.material as any;
            material.opacity += (targetOpacityWf - material.opacity) * 0.2;
            material.color.lerp(targetColor, 0.2);
          } else if (child instanceof THREE.Mesh && child.material.visible !== false) {
            const material = child.material as any;
            material.opacity += (targetOpacityFill - material.opacity) * 0.2;
            material.color.lerp(targetColor, 0.2);
          }
        });
      });

      renderer.render(scene, camera);
    };

    updateCamera();
    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    animate();

    cleanup(() => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      hardwareGroup.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach((material: { dispose: () => void }) => material.dispose());
          else child.material.dispose();
        }
        if (child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach((material: { dispose: () => void }) => material.dispose());
          else child.material.dispose();
        }
      });
      renderer.dispose();
      container.innerHTML = '';
    });
  });

  return (
    <div class="assembly-view relative flex h-full w-full flex-col overflow-hidden p-4 md:p-6 gap-4">
      <div class="assembly-grid-bg fixed inset-0 opacity-20 pointer-events-none z-0" />

      <AssemblyHeader uptimeLabel={uptimeLabel.value} />

      <div id="assembly-category-bar">
        <AssemblyCategoryBar
          state={state}
          onToggleCategory$={onToggleCategory$}
          onSelectComponent$={onSelectAssemblyComponent$}
        />
      </div>

      <AssemblyViewport
        containerRef={containerRef}
        state={state}
        hudStatus={hudStatus.value}
        onCanvasMouseLeave$={onCanvasMouseLeave$}
      />

      <AssemblyFooter
        state={state}
        onRemoveComponent$={onRemoveComponent$}
        onCompile$={onCompile$}
      />
    </div>
  );
});
