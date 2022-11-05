type phraseUnit = "a" | "b" | "c" | "d" | "a'" | "b'" | "c'" | "d'" | "[AC]" | "[HC]"
type meter = "2/2" | "2/4" | "2/8" | "3/2" | "3/4" | "3/8" | "4/2" | "4/4" | "4/8" | "6/2" | "6/4" | "6/8" | "9/2" | "9/4" | "9/8" | "12/2" | "12/4" | "12/8"

export interface Melody {
    _id: string
    composerId: string
    composer: string
    phrase?: phraseUnit[]
    meter?: meter
    hypermeter?: number[]
    harmonicRhythm?: number[]
    harmonicProgression?: string[]
    mgMelody?: string[]
    fgRhythm?: number[]
    result?: string[]
}