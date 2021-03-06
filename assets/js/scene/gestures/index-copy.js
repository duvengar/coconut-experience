import {
  MaterialManager
} from '../../materials/manager';
import * as THREE from 'three';
const OIMO = require('oimo');

const DRAG_STATUS_NONE = 'DRAG_STATUS_NONE';
const DRAG_STATUS_START = 'DRAG_STATUS_START';
const DRAG_STATUS_DRAGGING = 'DRAG_STATUS_DRAGGING';

class Gestures {
  constructor(scene, options = {}) {
    this.dragStatus = DRAG_STATUS_NONE;
    this.ray = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.scene = scene;
    this.meshes = [];

    this.dragPointView = new THREE.Mesh(
      new THREE.SphereGeometry(1, 8, 8),
      new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1,
      })
    );

    this.dragPlaneView = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200, 1, 1),
      new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      })
    );

    this.dragPlaneView.material.visible = false;

    let lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(
      new THREE.Vector3(),
      new THREE.Vector3()
    );

    this.dragLineView = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 1,
      })
    );

    this.dragPointView.visible = false;
    this.dragPlaneView.visible = false;
    this.dragLineView.visible = false;

    scene.scene.add(this.dragPointView);
    scene.scene.add(this.dragPlaneView);
    scene.scene.add(this.dragLineView);

    this.dragPointBody = scene.world.add({
      type: 'sphere',
      size: [0.20],
      pos: [0, 0, 0],
      move: true,
      noSleep: true,
      name: 'dragPointBody',
      config: [0.5, 0.4, 0.2, 1 << 2, 1 << 2],
    });

    let mouseMove = function (e) {
      this.mouseMove(e);
    }.bind(this);
    let mouseUp = function (e) {
      this.mouseUp(e);
    }.bind(this);
    let mouseDown = function (e) {
      this.mouseDown(e);
    }.bind(this);

    window.addEventListener('mousemove', mouseMove, true);
    window.addEventListener('mouseup', mouseUp, true);
    window.addEventListener('mousedown', mouseDown, true);

    return this.gestures;
  }

  mouseMove(e) {
    let intersects;
    this.updateMouse(e);

    this.ray.setFromCamera(this.mouse, this.scene.camera);

    if (this.dragStatus === DRAG_STATUS_NONE) {
      intersects = this.ray.intersectObjects(this.meshes, true);
    } else {
      intersects = this.ray.intersectObjects([this.dragPlaneView], true);
    }

    if (intersects.length > 0) {
      this.dragPoint = intersects[0].point;
    }
  }

  mouseUp(e) {
    if (this.dragStatus !== DRAG_STATUS_NONE) {
      this.dragStatus = DRAG_STATUS_NONE;
      this.scene.controls.enabled = true;
      this.dragPointView.visible = false;
      this.dragPlaneView.visible = false;
      this.dragLineView.visible = false;
      //this.dragLineModel.remove();
      //this.scene.world.remove(this.dragLineModel);
      //this.scene.world.remove(this.dragPoint);

      //this.dragPoint.remode();
    }
  }

  mouseDown(e) {
    let intersects;

    if (e.button !== 0) {
      return;
    }

    if (this.dragStatus !== DRAG_STATUS_NONE) {
      return;
    }

    this.updateMouse(e);
    this.ray.setFromCamera(this.mouse, this.scene.camera);
    intersects = this.ray.intersectObjects(this.meshes, true);

    const excluded = ['Ground', 'Sky', 'Fake_Water', 'Eye', 'Hole', 'Tile'];

    //let draggable = intersects.length > 0 && excluded.indexOf(intersects[0].object.name) === -1;

    let draggable = true;
    if (intersects.length > 0) {
      let name = intersects[0].object.name.split('_');
      for (let i = 0; i < excluded.length; i++) {
        for (let j = 0; j < name.length; j++) {
          if (name[j] == excluded[i]) {
            draggable = false;
          }
        }
      }
    }

    if (draggable) {
      this.dragStatus = DRAG_STATUS_START;
      this.scene.controls.enabled = false;
      this.dragPoint = intersects[0].point;
      this.dragBlockName = intersects[0].object.name;
      this.dragBlockLocalAnchorPoint = this.localAnchorPoint(
        this.dragBlockName,
        this.dragPoint
      );
    }
  }

  updateMouse(e) {
    this.mouse.x = (e.layerX / this.scene.options.dimensions.width) * 2 - 1;
    this.mouse.y = -(e.layerY / this.scene.options.dimensions.height) * 2 + 1;
  }

  localAnchorPoint(blockName, anchorPointInThree) {
    let mesh = this.scene.world.getByName(blockName);
    let anchorPoint = new OIMO.Vec3().copy(anchorPointInThree).multiplyScalar(OIMO.INV_SCALE);
    return anchorPoint;
  }

  dragLineConnect() {
    this.dragLineModel = this.scene.world.add({
      world: this.scene.world,
      type: 'jointBall',
      body1: 'dragPointBody',
      body2: this.dragBlockName,
      collision: false,
      pos1: [0, 0, 0],
      pos2: [
        this.dragBlockLocalAnchorPoint.x,
        this.dragBlockLocalAnchorPoint.y,
        this.dragBlockLocalAnchorPoint.z,
      ],
      min: 0,
      max: 1,
      spring: [100, 0.3],
    });
  }

  updateMeshes(objects) {
    let meshes = [];

    objects.map(function(object) {
      meshes.push(object.mesh);
    });

    this.meshes = meshes;
  }

  update() {
    if (this.dragStatus == DRAG_STATUS_START) {

      this.dragLineConnect();
      this.dragStatus = DRAG_STATUS_DRAGGING;
      this.dragPointView.visible = true;
      this.dragPlaneView.visible = true;
      this.dragLineView.visible = true;
    }

    if (this.dragStatus == DRAG_STATUS_DRAGGING) {
      this.dragPointBody.setPosition(this.dragPoint);
      this.dragPointView.position.copy(this.dragPoint);
      this.dragPlaneView.position.copy(this.dragPoint);
      this.dragPlaneView.quaternion.copy(this.scene.camera.quaternion);
      this.dragLineView.geometry.vertices[0].copy(this.dragLineModel.getPosition()[0]);
      this.dragLineView.geometry.vertices[1].copy(this.dragLineModel.getPosition()[1]);
      this.dragLineView.geometry.verticesNeedUpdate = true;
    }

    if (this.dragPoint) {
      this.dragPointBody.setPosition(this.dragPoint);
    }
  }
}

export default Gestures;
