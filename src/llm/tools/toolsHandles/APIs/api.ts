export async function api(url: string): Promise<{}> {
    const response = await fetch(url)

    if (!response.ok)
        throw new Error(response.statusText)

    return await response.json() as {}
}