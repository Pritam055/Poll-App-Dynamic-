// console.log("ajax called")

$(document).ready(function () {

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


    // delete poll
    $('.btn-del').on('click', function () {
        const qid = $(this).attr('data-pid');
        let mydata = {
            id: qid,
            csrfmiddlewaretoken: csrf
        }
        let mythis = this
        $.ajax({
            method: 'POST',
            url: 'delete-poll/',
            data: mydata,
            success: function (response) {
                console.log(response)
                if (response.status == 'success') {
                    console.log("deletion success");
                    $(mythis).closest('tr').fadeOut();
                }
                if (response.status == "fail") {
                    console.log("deletion failed");
                }
            },
            error: function (err) {
                console.log("Error: ", err)
            }

        })
    })


    // Add new Option
    $('#addOption-Form').on('submit', function (e) {
        e.preventDefault()
        const qid = $(this).attr("data-qid")
        let csrf = $('input[name=csrfmiddlewaretoken').val()
        let option = $('#id_option').val()
        let mydata = {
            qid: qid,
            option: option,
            csrfmiddlewaretoken: csrf
        }
        let output = "";
        let addMessage = $('#addMessage');

        if (option.trim() != "") {
            $.ajax({
                method: 'POST',
                url: `/add-option/${qid}/`,
                data: mydata,
                success: function (response) {
                    if (response.status == "success") {
                        console.log("option added successfully")
                        options = response.options
                        options.forEach((o) => {
                            output += `<span style="margin-right: 20px;">&#x2022; ${o.option}</span>`;
                        })
                        $('#optionList-id').html(output);
                        $('#id_option').val(``);

                        // option message
                        addMessage.html(`<div class="alert alert-success alert-dismissible fade show mt-2" role="alert">
                        <strong>Option added successfully !!!</strong>  
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      </div>`);
                        setTimeout(function () {
                            addMessage.html(``);
                        }, 10000);
                    } else if (response.status == "fail") {
                        console.log("failed to add option")
                        addMessage.html(`<div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Failed to add option !!!</strong>  
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      </div>`);
                        setTimeout(function () {
                            addMessage.html(``);
                        }, 4000);
                    } else {
                        pass
                    }
                },
                error: function (err) {
                    console.log("eRRor: ", err)
                    addMessage.html(`<div class="mt-2 alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Failed to add option !!!</strong>  
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`);
                    setTimeout(function () {
                        addMessage.html(``);
                    }, 4000);
                }
            })
        } else {
            alert("Empty option !!!")
        }
    })

})