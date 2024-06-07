export default async function nextFetch(endpoint: string) {
    const response = await fetch(endpoint);
    const data = await response.json();
}
