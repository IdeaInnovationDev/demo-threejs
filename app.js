// Three.js Scene Setup
let scene, camera, renderer, controls;
let raycaster, mouse;
let selectedObject = null;
let objects = [];
let gridHelper, axesHelper;

// Transform mode
let transformMode = 'none';

// Initialize the scene
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    const canvas = document.getElementById('three-canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - 150);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(-10, 10, -10);
    scene.add(pointLight);
    
    // Grid and Axes
    gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    scene.add(gridHelper);
    
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Ground plane (for shadows)
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // OrbitControls (using built-in if available)
    if (THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.mouseButtons = {
            LEFT: null, // We'll use left click for selection
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        };
    } else {
        console.error('OrbitControls not loaded. Camera controls will not be available.');
    }
    
    // Raycaster for object selection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Event Listeners
    setupEventListeners();
    
    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (controls) {
        controls.update();
    }
    
    renderer.render(scene, camera);
}

// Setup all event listeners
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse events for object selection
    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    
    // Toolbar buttons
    document.getElementById('add-rectangle').addEventListener('click', () => addShape('rectangle'));
    document.getElementById('add-circle').addEventListener('click', () => addShape('circle'));
    document.getElementById('add-polygon').addEventListener('click', () => addShape('polygon'));
    document.getElementById('extrude-shape').addEventListener('click', extrudeSelected);
    
    // Transform modes
    document.getElementById('move-mode').addEventListener('click', () => setTransformMode('move'));
    document.getElementById('rotate-mode').addEventListener('click', () => setTransformMode('rotate'));
    document.getElementById('scale-mode').addEventListener('click', () => setTransformMode('scale'));
    
    // Material
    document.getElementById('color-picker').addEventListener('change', changeColor);
    document.querySelectorAll('.material-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            document.getElementById('color-picker').value = color;
            changeColor();
        });
    });
    
    // Actions
    document.getElementById('delete-object').addEventListener('click', deleteSelected);
    document.getElementById('clear-scene').addEventListener('click', clearScene);
    document.getElementById('export-scene').addEventListener('click', exportScene);
    
    // View
    document.getElementById('reset-camera').addEventListener('click', resetCamera);
    document.getElementById('toggle-grid').addEventListener('click', toggleGrid);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', onKeyDown);
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 150);
}

// Mouse click handler
function onMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, false);
    
    if (intersects.length > 0) {
        selectObject(intersects[0].object);
    } else {
        deselectObject();
    }
}

// Mouse move handler
function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// Add 2D shape
function addShape(type) {
    let geometry;
    const color = document.getElementById('color-picker').value;
    
    switch(type) {
        case 'rectangle':
            geometry = new THREE.PlaneGeometry(2, 3);
            break;
        case 'circle':
            geometry = new THREE.CircleGeometry(1.5, 32);
            break;
        case 'polygon':
            geometry = new THREE.CircleGeometry(1.5, 6);
            break;
    }
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.1
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(
        Math.random() * 4 - 2,
        0.01,
        Math.random() * 4 - 2
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = type;
    mesh.userData.is2D = true;
    
    scene.add(mesh);
    objects.push(mesh);
    selectObject(mesh);
}

// Extrude selected 2D shape to 3D
function extrudeSelected() {
    if (!selectedObject) {
        alert('Please select a 2D shape first!');
        return;
    }
    if (!selectedObject.userData.is2D) {
        alert('Please select a 2D shape to extrude. 3D objects cannot be extruded again.');
        return;
    }
    
    const height = parseFloat(document.getElementById('extrude-height').value);
    const oldGeometry = selectedObject.geometry;
    const color = selectedObject.material.color.getHex();
    
    let newGeometry;
    
    // Create extruded geometry based on shape type
    if (selectedObject.userData.type === 'rectangle') {
        newGeometry = new THREE.BoxGeometry(2, height, 3);
    } else if (selectedObject.userData.type === 'circle') {
        newGeometry = new THREE.CylinderGeometry(1.5, 1.5, height, 32);
    } else if (selectedObject.userData.type === 'polygon') {
        newGeometry = new THREE.CylinderGeometry(1.5, 1.5, height, 6);
    }
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1
    });
    
    const mesh = new THREE.Mesh(newGeometry, material);
    mesh.position.copy(selectedObject.position);
    mesh.position.y = height / 2;
    mesh.rotation.copy(selectedObject.rotation);
    mesh.rotation.x = 0;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = selectedObject.userData.type;
    mesh.userData.is2D = false;
    
    // Remove old 2D shape
    scene.remove(selectedObject);
    objects = objects.filter(obj => obj !== selectedObject);
    
    // Add new 3D shape
    scene.add(mesh);
    objects.push(mesh);
    selectObject(mesh);
}

// Select object
function selectObject(obj) {
    deselectObject();
    selectedObject = obj;
    
    // Add selection indicator
    const bbox = new THREE.BoxHelper(obj, 0x00ff00);
    bbox.name = 'selectionBox';
    scene.add(bbox);
    
    updateSelectedInfo();
}

// Deselect object
function deselectObject() {
    if (selectedObject) {
        const selectionBox = scene.getObjectByName('selectionBox');
        if (selectionBox) {
            scene.remove(selectionBox);
        }
        selectedObject = null;
        updateSelectedInfo();
    }
}

// Update selected info display
function updateSelectedInfo() {
    const infoElement = document.getElementById('selected-info');
    if (selectedObject) {
        const type = selectedObject.userData.is2D ? '2D' : '3D';
        infoElement.textContent = `Selected: ${type} ${selectedObject.userData.type}`;
    } else {
        infoElement.textContent = '';
    }
}

// Change color of selected object
function changeColor() {
    if (!selectedObject) return;
    
    const color = document.getElementById('color-picker').value;
    selectedObject.material.color.set(color);
}

// Set transform mode
function setTransformMode(mode) {
    // Remove active class from all transform buttons
    document.querySelectorAll('#move-mode, #rotate-mode, #scale-mode').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (transformMode === mode) {
        transformMode = 'none';
    } else {
        transformMode = mode;
        document.getElementById(`${mode}-mode`).classList.add('active');
    }
}

// Delete selected object
function deleteSelected() {
    if (!selectedObject) {
        alert('No object selected!');
        return;
    }
    
    scene.remove(selectedObject);
    objects = objects.filter(obj => obj !== selectedObject);
    deselectObject();
}

// Clear all objects
function clearScene() {
    if (confirm('Clear all objects? This cannot be undone.')) {
        objects.forEach(obj => scene.remove(obj));
        objects = [];
        deselectObject();
    }
}

// Export scene data
function exportScene() {
    const sceneData = {
        objects: objects.map(obj => ({
            type: obj.userData.type,
            is2D: obj.userData.is2D,
            position: obj.position.toArray(),
            rotation: obj.rotation.toArray(),
            scale: obj.scale.toArray(),
            color: '#' + obj.material.color.getHexString()
        }))
    };
    
    const dataStr = JSON.stringify(sceneData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = '3d-cad-design.json';
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Design exported successfully!');
}

// Reset camera position
function resetCamera() {
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
    }
}

// Toggle grid visibility
function toggleGrid() {
    gridHelper.visible = !gridHelper.visible;
    axesHelper.visible = !axesHelper.visible;
}

// Keyboard shortcuts
function onKeyDown(event) {
    if (!selectedObject) return;
    
    const step = event.shiftKey ? 0.5 : 0.1;
    
    switch(event.key) {
        case 'Delete':
        case 'Backspace':
            deleteSelected();
            break;
        case 'ArrowUp':
            if (transformMode === 'move') {
                selectedObject.position.z -= step;
            } else if (transformMode === 'rotate') {
                selectedObject.rotation.x += step;
            } else if (transformMode === 'scale') {
                selectedObject.scale.multiplyScalar(1.1);
            }
            updateSelectionBox();
            break;
        case 'ArrowDown':
            if (transformMode === 'move') {
                selectedObject.position.z += step;
            } else if (transformMode === 'rotate') {
                selectedObject.rotation.x -= step;
            } else if (transformMode === 'scale') {
                selectedObject.scale.multiplyScalar(0.9);
            }
            updateSelectionBox();
            break;
        case 'ArrowLeft':
            if (transformMode === 'move') {
                selectedObject.position.x -= step;
            } else if (transformMode === 'rotate') {
                selectedObject.rotation.y += step;
            }
            updateSelectionBox();
            break;
        case 'ArrowRight':
            if (transformMode === 'move') {
                selectedObject.position.x += step;
            } else if (transformMode === 'rotate') {
                selectedObject.rotation.y -= step;
            }
            updateSelectionBox();
            break;
        case '+':
        case '=':
            if (transformMode === 'move') {
                selectedObject.position.y += step;
            }
            updateSelectionBox();
            break;
        case '-':
        case '_':
            if (transformMode === 'move') {
                selectedObject.position.y -= step;
            }
            updateSelectionBox();
            break;
    }
}

// Update selection box after transform
function updateSelectionBox() {
    const selectionBox = scene.getObjectByName('selectionBox');
    if (selectionBox) {
        selectionBox.update();
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
