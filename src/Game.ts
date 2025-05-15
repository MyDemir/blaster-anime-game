this.camera.position.set(0, 2, 6);
this.camera.lookAt(new THREE.Vector3(0, 0, 0));

// Küp testi
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 1, 0);
this.scene.add(box);

// Resize event
window.addEventListener('resize', () => {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
});
