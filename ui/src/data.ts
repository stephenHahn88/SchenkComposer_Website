import * as Tone from "tone";

export type Harmony = "I" | "ii" | "iii" | "IV" | "V" | "vi" | "vii"

export interface ProductionRule {
    "from": {value: string[], selected: boolean},
    "to": {value: string[], selected: boolean},
    "count": {value: number[], selected: boolean}
}

// GENERATE MUSIC FROM NOTES AND HARMONIES
const sampler = new Tone.Sampler({
    urls: {
        "C5": "C5.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

export function playNotesAndHarmony(notes: string[], harmonies: string[], tempo: number = 120) {
    Tone.loaded().then(() => {
        const now = Tone.now()

        // PLACE NOTES
        let curr = now
        for (let note of notes) {
            let noteQL = _triggerNotes(note, curr, tempo)
            curr += noteQL
        }

        // PLACE HARMONIES
        curr = now
        for (let harmony of harmonies) {
            let noteQL = 0;
            for (let note of harmony) {
                noteQL = _triggerNotes(note, curr, tempo)
            }
            curr += noteQL
        }
    })
}

function _triggerNotes(note: string, curr: number, tempo: number) {
    let noteName = _getNoteName(note)
    let noteQL = _getNoteQuarterlen(note) / 2 * (60 / tempo)
    sampler.triggerAttack(noteName, curr)
    sampler.triggerRelease(noteName, curr + noteQL)
    return noteQL
}

function _getNoteName(noteString: string) {
    return noteString.split(": ")[0]
}

function _getNoteQuarterlen(noteString: string) {
    return eval(noteString.split(": ")[1])
}


// FLATTEN RHYTHMS AND HARMONIES

export function flattenPhrase(phrase: string[]) {
    if (phrase == null) return
    return phrase
        .filter((s: string) => s.at(0) !== "[")
        .map((s: string) => s.at(0))
}

export function flattenMgRhythm(mgRhythm: any, phrase: string[]) {
    if (phrase == null) return
    let mgRhythmFlat = []
    for (let letter of phrase) {
        for (let measureString of mgRhythm[letter]) {
            mgRhythmFlat.push(measureString)
        }
    }
    return mgRhythmFlat
}

export function flattenMgRhythmLetter(mgRhythm: any, letter: string) {
    let mgRhythmFlat = []
    for (let measureString of mgRhythm[letter]) {
        mgRhythmFlat.push(measureString)
    }
    return mgRhythmFlat
}

export function flattenHarmony(harmony: any, phrase: string[]) {
    if (phrase == null) return
    let harmonyFlat = []
    for (let letter of phrase) {
        for (let harm of harmony[letter]) {
            harmonyFlat.push(harm)
        }
    }
    return harmonyFlat
}

export function flattenFgRhythm(fgRhythm: any, phrase: string[]) {
    if (phrase == null) return
    let fgFlat = []
    for (let letter of phrase) {
        for (let rhythm of fgRhythm[letter]) {
            for (let subrhythm of rhythm) {
                fgFlat.push(subrhythm)
            }
        }
    }
    return fgFlat
}