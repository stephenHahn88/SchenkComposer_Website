type phraseUnit = "a" | "b" | "c" | "d" | "a'" | "b'" | "c'" | "d'" | "[AC]" | "[HC]"
type meter = "2/2" | "2/4" | "2/8" | "3/2" | "3/4" | "3/8" | "4/2" | "4/4" | "4/8" | "6/2" | "6/4" | "6/8" | "9/2" | "9/4" | "9/8" | "12/2" | "12/4" | "12/8"

export interface Melody {
    _id: string
    composerId: string
    melodyId: string
    composer: string
    phrase?: phraseUnit[]
    meter?: meter
    hypermeter?: {"a"?: number, "b"?: number, "c"?: number, "d"?: number}
    mgRhythm?: {'a'?: string[], 'b'?: string[], 'c'?: string[], 'd'?: string[]}
    harmonicProgression?: string[]
    mgMelody?: string[]
    fgRhythm?: {'a'?: string[][], 'b'?: string[][], 'c'?: string[][], 'd'?: string[][]}
    result?: string[]
    transitionMatrix?: number[][]
}