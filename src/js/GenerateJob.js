//Generate detail page
function generateJob(datas){
    const jobs = datas[0].data
    console.log(jobs)
    const container = document.querySelector('.career-lists')
    let html = ``;
    for (let i = 0; i < jobs.length; i++) {
        
    html += `
    <li class="career-list">
        <div class="career-list__info">
            <h2 class="career-list__info__title">${jobs[i].title}</h2>
            <ul class="career-list__info__meta">
                <li>${jobs[i].department}</li>
                <li>${jobs[i].time}</li>
            </ul>
            <div class="career-list__info__department">
                <img src="./images/logo.svg" alt="">
            </div>
        </div>
        <div class="career-list__desc">
            <p>${jobs[i].decsription}</p>
            <a href="${jobs[i].link}" class="btn btn-light">Apply</a>
        </div>
    </li>
        `
    }
    container.innerHTML = html

}

export default generateJob