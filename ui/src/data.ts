import * as Tone from "tone";
import {Dot, StaveNote} from "vexflow";
import {router} from "@/main"

export type Harmony = "I" | "ii" | "iii" | "IV" | "V" | "vi" | "vii"

export interface ProductionRule {
    "from": {value: string[], selected: boolean},
    "to": {value: string[], selected: boolean},
    "count": {value: number[], selected: boolean}
}

export async function pushRouter(path: string) {
    // setTimeout(() => {router.push({path: path})}, 200)
    await router.push({path: path})
}


// Translates array of note glyphs to array of Vexflow StaveNote objects
export function _parseRhythms(rhythms: string) {
    let glyphs = rhythms.split(" ")
    let finalRhythms: StaveNote[] = []
    glyphs.forEach((glyph) => {
        switch (glyph) {
            case '♪': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '8'})); break;
            case '♪.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '8'}))); break;
            case '♩': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '4'})); break;
            case '♩.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '4'}))); break;
            case '𝅗𝅥': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '2'})); break;
            case '𝅗𝅥.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '2'}))); break;
            case '𝅝': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1'})); break;
            case '𝅝.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1'}))); break;
            case '𝅜': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1/2'})); break;
            case '𝅜.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1/2'}))); break;
            case '𝆷': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1/4'})); break;
            case '𝆷.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1/4'}))); break;
        }
    })
    return finalRhythms
}

// Attaches a rhythmic dot to a StaveNote
function _dotted(staveNote: StaveNote, noteIndex = -1) {
    if (noteIndex < 0) {
        Dot.buildAndAttach([staveNote], {
            all: true,
        });
    } else {
        Dot.buildAndAttach([staveNote], {
            index: noteIndex,
        });
    }
    return staveNote;
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

export function _quarterLengthToGlyph(ql: number) {
    switch (ql) {
        case 0.125: return "𝅘𝅥𝅰"
        case 0.1875: return "𝅘𝅥𝅰."
        case 0.25: return "𝅘𝅥𝅯"
        case 0.375: return "𝅘𝅥𝅯."
        case 0.5: return "𝅘𝅥𝅮"
        case 0.75: return "𝅘𝅥𝅮."
        case 1.0: return "♩"
        case 1.5: return "♩."
        case 2.0: return "𝅗𝅥"
        case 3.0: return "𝅗𝅥."
        case 4.0: return "𝅝"
        case 6.0: return "𝅝."
    }
}


// helper function to find the ending harmony for each phrase
export function _findPhraseEndHarmonies(phrase: string[], open: string[], close: string[]) {
    let answers = {}
    let curr;
    let prev;
    let i = 0
    for (let phraseUnit of phrase) {
        if (i === 0) {curr = phraseUnit; i++; continue;}
        prev = curr
        curr = phraseUnit
        if (curr === "[HC]") {
            // @ts-ignore
            answers[prev.at(0)] = open[Math.floor(Math.random() * open.length)]
        } else if (curr === "[AC]") {
            // @ts-ignore
            answers[prev.at(0)] = close[Math.floor(Math.random() * close.length)]
        }
        i++
    }
    return answers
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
    // let mgRhythmFlat = []
    // for (let measureString of mgRhythm[letter]) {
    //     mgRhythmFlat.push(measureString)
    // }
    return mgRhythm[letter]
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