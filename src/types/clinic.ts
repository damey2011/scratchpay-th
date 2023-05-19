export default interface Clinic {
    name: string
    state: string
    stateCode: string
    availability: {from: string, to: string}
}
