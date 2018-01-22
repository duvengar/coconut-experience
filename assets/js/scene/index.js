import * as THREE from 'three';

import Renderer from './renderer';
import Camera from './camera';
import Composer from './effectcomposer';
import Frustrum from './frustrum';
import CameraFrustrum from './camerafrustrum';
import Lights from './lights';
import Clock from './clock';
import World from './world';
import Gestures from './gestures';
import Controls from './controls';
import { MaterialManager } from '../materials/manager';
import { SoundManager } from '../sound/manager';

class Scene {
  constructor(options) {
    this.ismobile = true;
    this.options = options;
    this.lostcocos = 0;
    this.objects = [];
    this.cocos = [];
    this.Joints = [];
    this.cracks = [];
    this.notes = [];
    this.playnotes = [];
    this.lastJointPos = [];
    this.jointStrenth = [];

    this.options.dimensions = {
      width: this.options.renderer.canvas.offsetWidth,
      height: this.options.renderer.canvas.offsetHeight,
    };
    this.options.camera.distance = 10;
    this.options.camera.position = {
      x: 95,
      y: 20,
      z: 10,
    };

    this.options.camera.lookAt = new THREE.Vector3(0.0, 15.0, 0.0);
    this.scene = new THREE.Scene();
    this.count = true;
    this.renderer = new Renderer(options);
    this.textureRenderer = new Renderer(options);
    this.camera = new Camera(options);
    this.composer = new Composer(this.scene, this.camera, this.renderer,
    this.options.dimensions.width, this.options.dimensions.height);
    this.lightfrustrum = new CameraFrustrum(options);
    this.lights = new Lights(options, this.camera, this.lightfrustrum);
    this.world = new World();
    this.clock = new Clock();

    // Debugg Lights
    //this.frustrum = new Frustrum(this.lightfrustrum);
    return this;
  }

  init() {
    this.scene.fog = new THREE.FogExp2(
      new THREE.Color(this.options.colors.fog),
      this.options.scene.fog.factor
    );

    //console.log('W: ' + this.options.dimensions.width + ' H: ' + this.options.dimensions.height);
    if (this.options.dimensions.width >= 1080) {
      this.ismobile = false;
    }

    // Lights
    this.lights.forEach(light => this.scene.add(light));

    // Debugg Lights
    //this.scene.add(this.frustrum);

    // Event Listeners
    let updateSize = () => this.updateSize();
    window.addEventListener('resize', updateSize, false);
    this.gestures = new Gestures(this);
    this.controls = new Controls(this.options, this.camera);
    this.controls.enabled = false;
  }

  updateSize() {
    this.options.dimensions = {
      width: this.options.renderer.canvas.offsetWidth,
      height: this.options.renderer.canvas.offsetHeight,
    };

    this.camera.aspect =
      this.options.dimensions.width / this.options.dimensions.height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.options.dimensions.width,
      this.options.dimensions.height,
      false
    );
  }

  initCocos() {

    if (this.world.numJoints != null) {
      for (let i = 0; i < this.Joints.length; i++) {
        let pos = new THREE.Vector3(this.Joints[i].body1.position.x,
        this.Joints[i].body1.position.y,
        this.Joints[i].body1.position.z);
        this.cracks.push(1);
        this.lastJointPos.push(pos);
        this.jointStrenth.push(1);
      }

      this.count = false;
    }
  }

  initNotes() {

    for (let i = 0; i < this.notes.length; i++) {
      this.playnotes[i] = false;
    }
  }

  updateNotes() {

    const getRandomIntInclusive = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    for (let i = 0; i < this.notes.length; i++) {

      if (this.notes[i].mesh.material == MaterialManager.get('toon_cyan')) {

        if (this.playnotes[i] === false) {
          SoundManager.play('contact_' + getRandomIntInclusive(0, 4));
          this.playnotes[i] = true;
        }
      } else {
        this.playnotes[i] = false;
      }
    }
  }

  updateCocos() {

    if (this.world.numJoints != null) {
      for (let i = 0; i < this.Joints.length; i++) {
        let pos = new THREE.Vector3(
          this.Joints[i].body1.position.x,
          this.Joints[i].body1.position.y,
          this.Joints[i].body1.position.z
        );
        let pos2 = this.lastJointPos[i];
        let dist = pos.distanceTo(pos2);

        if (dist > 0.15) {
          if (this.jointStrenth[i] > 0) {
            this.jointStrenth[i] -= 0.5;
          }
        } else if (dist <= 0.03 && this.jointStrenth[i] <= 0) {
          this.world.removeJoint(this.Joints[i]);
          if (this.jointStrenth[i] == 0) {
            this.lostcocos++;
            this.jointStrenth[i] = -1;
          }
        }

        if (this.lostcocos > 0 && this.jointStrenth[i] == -1) {
          let c = this.Joints[i].body1.numContacts;

          if (c == 1 && this.cracks[i] > 0) {
            SoundManager.play('contact');
            this.cracks[i]--;
          }
        }

        this.lastJointPos[i] = pos;
      }
    }
  }

  preloopWorld(num) {
    for (var i = 0; i < num; i++) {
      this.world.step();
    }
  }

  updateCamera() {
    if (this.camera.position.x > 75) {
      this.camera.position.x -= 0.25;
    }

    if (this.camera.position.z > 0) {
      this.camera.position.z -= 0.125;
    }
  }

  updatePositions() {
    this.world.step();
    this.updateCamera();
    this.objects.forEach(function (object) {

      if (object.hasOwnProperty('body') === true) {
        object.mesh.position.copy(object.body.getPosition());
        object.mesh.quaternion.copy(object.body.getQuaternion());
      }

      if (object.mesh.name === 'Wolf' || object.mesh.name === 'Ghost') {
        object.mesh.rotation.set(0, this.clock.getElapsedTime() * 0.1, 0);
      }

    }.bind(this));
  }

  updateGestures() {
    this.gestures.update();
  }

  updateShaders() {

    if (MaterialManager.get('smooth_cloud') != null) {
      let material = MaterialManager.get('smooth_cloud');
      material.uniforms.iGlobalTime.value = this.clock.getElapsedTime();
    }
  }

  updateMaterials() {
    this.objects.forEach(function (object) {
      if (object.hasOwnProperty('body') === true) {

        const updatables = [
          'TrunkSegment',
          'Crown',
          'Coco',
          'Tile',
          'Wolf',
          'Moon',
          'Sky',
          'Starfield',
        ];

        const parts = object.mesh.name.split('_');
        const matches = parts.filter(part => updatables.indexOf(part) > -1 ? true : false);
        const name = parts.length > 0 && matches.length > 0 ?
          matches[0] :
          object.mesh.name;

        if (object.body.sleeping) {
          const sleepingMaterials = {
            Tile: 'toon_darkpurple',
            Crown: 'celshading_purple',
            Coco: 'celshading_lightblue',
            TrunkSegment: 'celshading_stripes_material',
            Sky: 'smooth_cloud',
            Starfield: 'starfield',
            Wolf: 'celshading_purple',
            Moon: 'moon',
          };

          object.mesh.material = sleepingMaterials.hasOwnProperty(name) ?
            MaterialManager.get(sleepingMaterials[name]) :
            MaterialManager.get('toon_darkpurple');
        } else {

          const materials = {
            TrunkSegment: 'celshading_stripes_material',
            Crown: 'celshading_purple',
            Coco: 'celshading_lightblue',
            Tile: 'toon_cyan',
            Sky: 'smooth_cloud',
            Starfield: 'starfield',
            Wolf: 'celshading_pink',
            Moon: 'moon',
          };

          object.mesh.material = materials.hasOwnProperty(name) ?
            MaterialManager.get(materials[name]) :
            MaterialManager.get('toon_darkpurple');
        }
      }
    }.bind(this));
  }

  oclMaterials() {
    this.objects.forEach(function (object) {
      if (object.hasOwnProperty('body') === true) {

        const updatables = [
          'Tile',
          'Moon',
          'Wolf',
          'TrunkSegment',
          'Coco',
          'Crown',
          'Sky',
          'Starfield',
        ];

        const parts = object.mesh.name.split('_');

        let objectId = parts[2];
        let match = false;
        if (parts[2] == 'Coco') {
          let id = parts[1];
          if (id == this.gestures.objectDragged
              && this.gestures.dragStatus === 'DRAG_STATUS_DRAGGING') {
            match = true;
          } else {
            match = false;
          }
        };

        const matches = parts.filter(part => updatables.indexOf(part) > -1 ? true : false);
        const name = parts.length > 0 && matches.length > 0 ?
          matches[0] :
          object.mesh.name;

        if (object.body.sleeping) {
          const sleepingMaterials = {
            Tile: 'absolute_black',
            Moon: 'absolute_lightgrey',
          };

          object.mesh.material = sleepingMaterials.hasOwnProperty(name) ?
            MaterialManager.get(sleepingMaterials[name]) :
            MaterialManager.get('absolute_black');
        } else {
          const materials = {
            Tile: 'absolute_white',
            Moon: 'moon_cel',
            Coco: match === true ?  'absolute_mediumgrey' : 'blank_material',
            Sky: 'blank_material',
            Stafield: 'blank_material',
            Wolf: 'blank_material',
          };

          object.mesh.material = materials.hasOwnProperty(name) ?
            MaterialManager.get(materials[name]) :
            MaterialManager.get('absolute_black');

        }
      }
    }.bind(this));
  }

  renderEffect() {
    this.renderer.setClearColor(0x000000);
    this.composer.occlusionComposer.render();
  }

  render() {

    this.renderer.setClearColor(this.options.colors.background);
    this.composer.blendingComposer.render();
  }

  animate() {

    this.updateGestures();
    this.updatePositions();
    this.updateShaders();

    if (this.count === true) {
      this.initNotes();
      this.initCocos();
    } else {
      this.updateCocos();
    }

    this.oclMaterials();
    this.renderEffect();
    this.updateMaterials();
    this.updateNotes();
    this.camera.lookAt(this.options.camera.lookAt);
    this.render();

    let animate = function () {
      this.animate();
    }.bind(this);
    requestAnimationFrame(animate);
  }

  add(mesh, physics = {}) {
    this.scene.add(mesh);

    let object = {};

    // If there's physics, let's add the object to OIMO
    if (typeof physics === 'object' && Object.keys(physics).length > 0) {

      if (physics.hasOwnProperty('size') === false) {
        physics.size = [mesh.scale.x, mesh.scale.y, mesh.scale.z];
      }

      if (physics.hasOwnProperty('position') === false) {
        physics.pos = [mesh.position.x, mesh.position.y, mesh.position.z];
      }

      if (physics.hasOwnProperty('rotation') === false) {
        physics.rot = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z];
      }

      physics.name = mesh.name;

      let body = this.world.add(physics);

      object = {
        mesh: mesh,
        body: body,
      };
    } else {
      // If not, we only push the mesh
      object = {
        mesh: mesh,
      };
    }

    this.objects.push(object);
    this.gestures.updateMeshes(this.objects);
    return object;
  }
}

export default Scene;
