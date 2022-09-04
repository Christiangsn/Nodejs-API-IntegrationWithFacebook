export interface IAuthorize {
    auth: (params: { token: string }) => Promise<string>
}
