import * as THREE from 'three';

// GEOMETRY
import Sphere from './geometry/sphere';
import Cylinder from './geometry/cylinder';
import Box from './geometry/box';

// OBJECTS
import Scene from './scene';
import Floor from './objects/floor';
import Palmtree from './objects/palmtree';

//import Landscape from './objects/landscape';
import Wolf from './objects/loader';
import Moon from './objects/moon';
import Sky from './objects/sky';

// MATERIALS
//import WireMaterial from './materials/wireframebasic.js';
import StarFieldMaterial from './materials/starfieldmaterial.js';
import BlankMaterial from './materials/blankmaterial.js';
import MoonMaterial from './materials/moonmaterial.js';
import MoonCelMaterial from './materials/mooncelmaterial.js';
//import PhongReflectiveMaterial from './materials/phongreflective.js';
import PhongColorMaterial from './materials/phongcolormaterial.js';
import AbsoluteColorMaterial from './materials/absolutecolormaterial.js';
import ToonColorMaterial from './materials/tooncolormaterial.js';
import StripesMaterial from './materials/stripesmaterial.js';
import CelShadingMaterial from './materials/celshadingmaterial.js';
import CelShadowMaterial from './materials/celshadingshadowmaterial.js';
//import TransparenceMaterial from './materials/transparence_basic.js';
//import ShadowShaderMaterial from './materials/shadowmaterial.js';
//import DisplacementShaderMaterial from './materials/displacementmaterial.js';
//import DisplacementBoxShaderMaterial from './materials/displacementbox.js';
import SmoothCloudMaterial from './materials/smoothcloudmaterial.js';
//import MakeMaterial from './materials/makematerial.js';
import shaderParse from './shaders/shaderparse.js';

// MATERIAL MANAGER
import { MaterialManager } from './materials/manager';

import { SoundManager } from './sound/manager';
import WebfontLoader from 'webfontloader';
import WhenDomReady from 'when-dom-ready';

class App {
  constructor() {
    this.options = {
      renderer: {
        canvas: document.getElementById('canvas'),
      },
      camera: {
        distance: 40,
        fov: 35,
        near: .5,
        far: 1500,
        lookAt: {
          x: 0,
          y: 20,
          z: 0,
        },
        position: {
          x: 0,
          y: 3,
          z: 0,
        },
      },
      colors: {
        purple: 0x6331FF,
        fog: 0x3d1687,
        background: 0x3d1687,
        blue: 0x106cc1,
        cyan: 0x74fbff,
        lightcyan: 0xacf0ff,
        darkgrey: 0X3b3b3b,
        mediumgrey: 0x717171,
        lightgrey: 0xc7c7c7,
        darkpurple: 0x2b1354,
        darkblue: 0x330c91,
        lightblue: 0xcdcaec,
        bluishgrey: 0xbacbdb,
        pink: 0xf937be,
        grey: 0x2b1354,
        white: 0xffffff,
        black: 0x000000,
      },
      scene: {
        fog: {
          factor: .010,
        },
      },
      sound: {
        muted: false,
      },
    };

    this.scene = new Scene(this.options);
    this.scene.init();
    this.registerMaterials();
    this.registerSounds();
    this.populateScene();
    this.scene.preloopWorld(40);
    this.scene.animate();
    this.webfonts();
    this.bindings();
  }

  webfonts() {
    WebfontLoader.load({
        typekit: {
            id: 'kkp5dfn',
        },
        google: {
            families: ['Cousine:400']
        }
    });
  }

  bindings() {
    const intro = document.querySelector('.intro');

    intro.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        intro.classList.add('is-inactive');
        this.options.renderer.canvas.classList.add('is-active');
    });

    const volume = document.querySelector('.volume');

    volume.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();

        volume.classList.toggle('is-active');
        SoundManager.mute(!this.options.sound.muted);

        this.options.sound.muted = !this.options.sound.muted;
    });
  }

  registerMaterials() {

    new BlankMaterial();
    new StarFieldMaterial(this.options.colors, this.scene.renderer.getSize());
    new MoonCelMaterial(this.scene, this.scene.renderer.getSize());
    new MoonMaterial(this.scene);
    new SmoothCloudMaterial(this.scene.options.colors);
    new StripesMaterial(this.scene);
    new CelShadingMaterial(this.scene);
    new PhongColorMaterial(this.scene,
      new THREE.Color(this.options.colors.bluishgrey),
      new THREE.Color(this.options.colors.darkpurple),
      new THREE.Color(this.options.colors.white),
     'purple'
   );

    new CelShadingMaterial(this.scene,
      new THREE.Color(this.options.colors.bluishgrey),
      new THREE.Color(this.options.colors.purple),
       'purple'
     );
    new CelShadingMaterial(this.scene,
      new THREE.Color(this.options.colors.white),
      new THREE.Color(this.options.colors.cyan),
      'lightblue'
    );
    new CelShadingMaterial(this.scene,
      new THREE.Color(this.options.colors.cyan),
      new THREE.Color(this.options.colors.purple),
      'cyan'
    );
    new CelShadingMaterial(this.scene,
      new THREE.Color(this.options.colors.lightcyan),
      new THREE.Color(this.options.colors.purple),
      'pink'
    );

    new CelShadowMaterial(this.scene, new THREE.Color(0x2b2b2b), 'grey');
    new CelShadowMaterial(this.scene, new THREE.Color(0x61ffd9), 'blue');
    new CelShadowMaterial(this.scene, new THREE.Color(0xff5be0), 'pink');
    new ToonColorMaterial(this.scene, new THREE.Color(this.options.colors.darkpurple), 'darkpurple');
    new ToonColorMaterial(this.scene, new THREE.Color(this.options.colors.grey), 'grey');
    new ToonColorMaterial(this.scene, new THREE.Color(this.options.colors.blue), 'blue');
    new ToonColorMaterial(this.scene, new THREE.Color(this.options.colors.cyan), 'cyan');
    new AbsoluteColorMaterial(this.scene, new THREE.Color(this.options.colors.white), 'white');
    new AbsoluteColorMaterial(this.scene, new THREE.Color(this.options.colors.black), 'black');
    new AbsoluteColorMaterial(this.scene, new THREE.Color(this.options.colors.darkgrey), 'darkgrey');
    new AbsoluteColorMaterial(this.scene, new THREE.Color(this.options.colors.mediumgrey), 'mediumgrey');
    new AbsoluteColorMaterial(this.scene, new THREE.Color(this.options.colors.lightgrey), 'lightgrey');
  }

  registerSounds() {
    SoundManager.register({
        ambiance: {
            src: ['/dist/sounds/atmosphere.mp3'],
            autoplay: true,
            loop: true,
        },
        theme: {
            src: ['/dist/sounds/theme.mp3'],
            autoplay: true,
        },
        wolf: {
            src: ['/dist/sounds/wolf.mp3'],
        },
        'contact_0': {
            src: ['/dist/sounds/contact/0.mp3'],
        },
        'contact_1': {
            src: ['/dist/sounds/contact/1.mp3'],
        },
        'contact_2': {
            src: ['/dist/sounds/contact/2.mp3'],
        },
        'contact_3': {
            src: ['/dist/sounds/contact/3.mp3'],
        },
        'contact_4': {
            src: ['/dist/sounds/contact/4.mp3'],
        },
    });
  }

  populateScene() {

    new Moon(this.scene, {
      index: 0,
      widthSegments: 30,
      heightSegments: 30,
      radius: 1,
      scale: {
        x: 150,
        y: 150,
        z: 150,
      },
      position: {
        x: -800,
        y: 10,
        z: 0,
      },
    });

    if (this.scene.ismobile != true) {
      new Sky(this.scene, {
        radius: 70,
      });
    }

    new Floor(this.scene, {
      size: {
        w: 7,
        h: 7,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: {
        x: 6,
        y: 16,
        z: 6,
      },
    });

    new Wolf(this.scene, {
      name: 'Wolf_',
      index: 0,
      position: {
        x: 0.5,
        y: 20,
        z: 0.5,
      },
    });

    new Palmtree(this.scene, {
      name: 'Palmtree_',
      index: 1,
      position: {
        x: 0,
        y: 10,
        z: 6,
      },
    });
    new Palmtree(this.scene, {
      name: 'Palmtree_',
      index: 2,
      position: {
        x: 6,
        y: 8,
        z: -6,
      },
    });
  }
}

WhenDomReady().then(() => new App());
