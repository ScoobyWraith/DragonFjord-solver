export default interface IJsonSerializable<T> {
    serialize(): string
    deserialize(jsonData: string): T 
}