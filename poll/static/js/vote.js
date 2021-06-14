// console.log("vote called");

$(document).ready(function () {

    const getData = () => {
        // get question id
        const qid = $('#question-id').attr("data-qid");
        let checkbox = $('#checkbox-id');
        let output = ``;

        $.ajax({
            method: 'GET',
            url: `/vote_page/${qid}/`,
            success: function (response) {
                data = response.data
                data.forEach((opt) => {
                    // console.log(opt.voted) 
                    if (opt.voted) {
                        output += ` <div class="form-check box">
                        <p style="margin-bottom:0px;">Added by <b class="created-user">${opt.created_by}</b></p>
                        <input class="form-check-input" type="checkbox" value=""  id="checkId-${opt.id}" data-oid="${opt.id}" checked>
                        <label class="form-check-label" for="checkId-${opt.id}">
                        <b>${opt.option}</b> <span class="voteDisplay" id="voteDisplay-${opt.id}" style="margin-left:100px;">${opt.vote_count} votes</span>
                        </label>             
                    </div><hr>`;
                    } else {
                        output += ` <div class="form-check box">
                        <p style="margin-bottom:0px;">Added by <b class="created-user">${opt.created_by}</b></p>
                        <input class="form-check-input" type="checkbox" value=""  id="checkId-${opt.id}" data-oid="${opt.id}">
                        <label class="form-check-label" for="checkId-${opt.id}">
                        <b>${opt.option}</b> <span class="voteDisplay" id="voteDisplay-${opt.id}" name="voteDisplay" style="margin-left:100px;">${opt.vote_count} votes</span>
                        </label>
                    </div><hr>`;
                    }

                })
                checkbox.html(output);
            },
            error: function (err) {
                console.log("Error: " + error)
            }
        })
    }

    // load vote options
    getData();


    // get csrf token from cookie
    let getCookie = name => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrf = getCookie('csrftoken');


    //checkbox Vote function
    $(document).on("change", "input[type='checkbox']", function () {
        let id = $(this).attr('data-oid')
        let voteMessage = $('#voteMessage');
        let mydata = {
            id: id,
            csrfmiddlewaretoken: csrf
        }

        $.ajax({
            method: 'POST',
            url: '/votting/',
            data: mydata,
            success: function (response) {
                if (response.status == 'success') {

                    // changing vote count
                    let allSpan = document.querySelectorAll('.voteDisplay')
                    allSpan.forEach(span => {
                        if (span.id.indexOf(id) != -1) {
                            span.textContent = `${response.vote_count} votes`
                        }
                    })

                    // Above can also be done by
                    /*
                        let voteDisplay = document.getElementById(`voteDisplay-${id}`);
                        voteDislay.textContent =  `${response.vote_count} votes`; 
                     */

                    voteMessage.html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Vote success</strong>  
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`);
                    setTimeout(function () {
                        voteMessage.html(``);
                    }, 4000);
                } else if (response.status == 'fail') {
                    console.log("failed POST request")
                    voteMessage.html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>Vote Failed</strong>  
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`);
                    setTimeout(function () {
                        voteMessage.html(``);
                    }, 4000);
                } else {
                    pass
                }
            },
            error: function (err) {
                console.log("ERror: ", err)
            }
        });


    });
     

    // radio Vote function
    /* $('input[type="radio"]').change(function () {
        const id = $(this).attr('data-oid');
        let voteMessage = $('#voteMessage');
        $.ajax({
            method: 'POST',
            url: '/votting/',
            data: {
                id: id,
                csrfmiddlewaretoken: csrf
            },
            success: function (response) {
                if (response.status == 'success') {
                    console.log(response)
                    voteMessage.html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Vote success</strong>  
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`);
                    setTimeout(function () {
                        voteMessage.html(``);
                    }, 4000);
                }
                if (response.status == 'fail') {
                    console.log("failed POST request")
                    voteMessage.html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>Vote Failed</strong>  
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`);
                    setTimeout(function () {
                        voteMessage.html(``);
                    }, 4000);
                }
            },
            error: function (err) {
                console.log("ERror: ", err)
            }
        })
    }) */
})



// got from stackoverflow from checkbox change
/* $(document).on("change", "input[type='checkbox']", function () {
    alert("FECK");
    if (this.checked) {}
}); */