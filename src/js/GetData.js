export async function getJSON(url){
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error
    }
}

export async function getCareer(url){
    const dataJSON = await getJSON(url);
    const datas = [dataJSON.career].map(async (data)=> {
        return {data}
    })

    return Promise.all(datas)
}