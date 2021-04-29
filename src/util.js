export const sortDataHelper = (data) => {
    const sortedData = [...data]
    
    return sortedData.sort((a, b) => 
        (a.cases > b.cases ? -1 : 1))
    // or, we can do:
    // sortedData.sort((a, b) => {
    //     if (a.cases > b.cases) return -1
    //     else return 1
    // })
    // return sortedData
}