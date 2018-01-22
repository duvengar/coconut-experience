import { Howl, Howler } from 'howler';

class Manager {
    constructor() {
        this.library = {};
    }

    register(manifest) {
        const handles = Object.keys(manifest);

        handles.forEach(handle => {
            this.library[handle] = new Howl(manifest[handle]);
        });
    }

    play(sound) {
        if (this.has(sound)) {
            this.library[sound].play();
        }
    }

    has(sound) {
        return this.library.hasOwnProperty(sound);;
    }

    mute(muted) {
        Howler.mute(muted);
    }
}

export const SoundManager = new Manager();
