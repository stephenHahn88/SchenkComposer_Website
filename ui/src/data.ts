import * as Tone from "tone";
import {Dot, StaveNote} from "vexflow";
import {router} from "@/main"


export let textEmphasisColor = 'rgb(200, 50, 255)'

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
            case '1/8':
            case '♪': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '8'})); break;
            case '1/8.':
            case '♪.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '8'}))); break;
            case '1/4':
            case '♩': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '4'})); break;
            case '1/4.':
            case '♩.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '4'}))); break;
            case '1/2':
            case '𝅗𝅥': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '2'})); break;
            case '1/2.':
            case '𝅗𝅥.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '2'}))); break;
            case '1':
            case '𝅝': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1'})); break;
            case '1.':
            case '𝅝.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1'}))); break;
            case '2':
            case '𝅜': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1/2'})); break;
            case '2.':
            case '𝅜.':finalRhythms.push(_dotted(new StaveNote({ keys: ["b/4"], duration: '1/2'}))); break;
            case '4':
            case '𝆷': finalRhythms.push(new StaveNote({ keys: ["b/4"], duration: '1/4'})); break;
            case '4.':
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
const piano = new Tone.Sampler({
    urls: {
        "C5": "C5.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const casio = new Tone.Sampler({
    urls: {
		A1: "A1.mp3",
		A2: "A2.mp3",
	},
    release: 1,
	baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();

// Audio files credit: https://github.com/nbrosowsky/tonejs-instruments/tree/master/samples
const violin = new Tone.Sampler({
    urls: {
		A3: "samples_violin_A3.mp3",
        C4: "samples_violin_C4.mp3",
		E5: "samples_violin_E5.mp3",
	},
    release: 1,
	baseUrl: "http://localhost:8090/src/static/samples/" || "https://melody.cs.duke.edu:8000/src/static/samples/",
}).toDestination();

const cello = new Tone.Sampler({
    urls: {
		A3: "samples_cello_A3.mp3",
        C4: "samples_cello_C4.mp3",
		E4: "samples_cello_E4.mp3",
	},
    release: 1,
	baseUrl: "http://localhost:8090/src/static/samples/" || "https://melody.cs.duke.edu:8000/src/static/samples/",
}).toDestination();

const flute = new Tone.Sampler({
    urls: {
		A4: "samples_flute_A4.mp3",
        C5: "samples_flute_C5.mp3",
		// E4: "samples_flute_E4.mp3",
	},
    release: 1,
	baseUrl: "http://localhost:8090/src/static/samples/" || "https://melody.cs.duke.edu:8000/src/static/samples/",
}).toDestination();

const guitar = new Tone.Sampler({
    urls: {
		A3: "samples_guitar-electric_A3.mp3",
		C4: "samples_guitar-electric_C4.mp3",
        E2: "samples_guitar-electric_E2.mp3",
	},
    release: 1,
	baseUrl: "http://localhost:8090/src/static/samples/" || "https://melody.cs.duke.edu:8000/src/static/samples/",
}).toDestination();

const saxophone = new Tone.Sampler({
    urls: {
		D5: "samples_saxophone_D4.mp3",
		C6: "samples_saxophone_C5.mp3",
        A5: "samples_saxophone_A4.mp3",
	},
    release: 1,
	baseUrl: "http://localhost:8090/src/static/samples/" || "https://melody.cs.duke.edu:8000/src/static/samples/",
}).toDestination();

const marimba = new Tone.Sampler({
    urls: {
		C5: "marimba_c5.wav",
		G5: "marimba_g5.wav",
        E4: "marimba_e4.wav",
	},
    release: 1,
	baseUrl: "http://localhost:8090/src/static/samples/"  || "https://melody.cs.duke.edu:8000/src/static/samples/",
}).toDestination();

// Decrease volume switch
// const melodyVol = new Tone.Volume(-12).toDestination();
// const middleVol = new Tone.Volume(-40).toDestination();
// const harmonyVol = new Tone.Volume(-12).toDestination();
// const bassVol = new Tone.Volume(-12).toDestination();

export function playNotesAndHarmony(
    melody: string[],
    middle: string[],
    harmonies: string[][],
    bass: string[],
    instrument: string = "piano",
    tempo: number = 120,
    selectedLayers: string[] = ["melody", "harmony", "bass"]
) {
    Tone.loaded().then(() => {
        let {melodySampler, middleSampler, harmonySampler, bassSampler} = _getInstrumentSamplers(instrument)

        // melodySampler.connect(melodyVol);
        // middleSampler.connect(middleVol);
        // harmonySampler.connect(harmonyVol);
        // bassSampler.connect(bassVol)

        const now = Tone.now()

        let curr;
        // PLACE MELODY
        if (selectedLayers.includes("melody")) {
            curr = now
            for (let note of melody) {
                let noteQL = _triggerNotes(note, curr, tempo, melodySampler)
                curr += noteQL
            }
        }

        // PLACE ARPEGGIOS
        if (selectedLayers.includes("harmony")) {
            curr = now
            for (let mid of middle) {
                let noteQL = _triggerNotes(mid, curr, tempo, middleSampler)
                curr += noteQL
            }
        }

        //PLACE BASS
        if (selectedLayers.includes("bass")) {
            curr = now
            for (let b of bass) {
                let noteQL = _triggerNotes(b, curr, tempo, bassSampler)
                curr += noteQL
            }
        }

        // PLACE HARMONIES
        // curr = now
        // for (let harmony of harmonies) {
        //     let noteQL = 0;
        //     for (let note of harmony) {
        //         noteQL = _triggerNotes(note, curr, tempo, harmonySampler)
        //     }
        //     curr += noteQL
        // }
    })
}


function _getInstrumentSamplers(instrument: string) {
    let melodySampler;
    let middleSampler;
    let harmonySampler;
    let bassSampler;

    switch(instrument) {
        case "piano": {
            melodySampler = piano;
            middleSampler = piano;
            harmonySampler = piano;
            bassSampler = piano
            break;
        }
        case "casio": {
            melodySampler = casio;
            middleSampler = casio;
            harmonySampler = casio;
            bassSampler = casio;
            break;
        }
        case "strings": {
            melodySampler = cello;
            middleSampler = cello;
            harmonySampler = cello;
            bassSampler = cello;
            break;
        }
        case "marimba": {
            melodySampler = marimba;
            middleSampler = piano;
            harmonySampler = piano;
            bassSampler = piano;
            break;
        }
        default: {
            melodySampler = piano;
            middleSampler = piano;
            harmonySampler = piano;
            bassSampler = piano;
            break;
        }
    }
    return {melodySampler, middleSampler, harmonySampler, bassSampler}
}


function _triggerNotes(note: string, curr: number, tempo: number, sampler: Tone.Sampler) {
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