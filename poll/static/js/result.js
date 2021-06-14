// console.log("result");

$(document).ready(function () {

    // chart data
    function displayChart() {
        let url = window.location.href
        let arr = url.split('/')
        let qid = arr[arr.length - 2]
        // console.log(qid)
        $.ajax({
            method: 'GET',
            url: `/chart-data/${qid}`,
            data: {
                qid: qid
            },
            success: function (response) {
                if (response.status == 'success') {
                    console.log(response.data)
                    console.log(response.labels)
                    setChart(response.data, response.labels);

                } else if (response.status == 'fail') {
                    console.log("failed to get data")
                } else {
                    pass
                }
            },
            error: function (err) {
                console.log("eRRor: ", err)
            }
        });
    }


    function generateColor(){
        return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)

        // let r = () => Math.random() * 256 >> 0;
        // let color = `rgb(${r()}, ${r()}, ${r()})`;
        // return color
    }

    function setChart(data, labels) { 
        var ctx = document.getElementById('myChart').getContext('2d');
        let colors = []
        for(let i=0;i<data.length; i++){
            colors.push(generateColor())
        }
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Poll vote result',
                    data: data,
                    backgroundColor: colors,
                    borderColor:colors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    displayChart()

    // modal data pop-up
    $('.modal-btn').on('click', function () {
        console.log('cicked')
        let oid = $(this).attr("data-oid")
        let mydata = {
            id: oid
        }
        $.ajax({
            method: 'GET',
            url: '/option-data/',
            data: mydata,
            success: function (response) {
                if (response.status == 'success') {
                    let output = ``;
                    response.voter_list.forEach(voter => {
                        output += `<li>${voter.username}</li>`;
                    })

                    // voter list title
                    let voter_list_display = document.getElementById(`exampleModalLabel-${oid}`);
                    voter_list_display.innerHTML = `Voter List for '<b>${response.option}'</b> option`;

                    // display voter list

                    let voter_list = document.getElementById(`modal-body-ul-${oid}`);
                    if (output == "") {
                        voter_list.innerHTML = "empty voter list !!!"
                    } else {
                        voter_list.innerHTML = output;
                    }

                } else if (response.status == 'fail') {
                    console.log("Something went wrong !!!");
                } else {
                    pass
                }
            },
            error: function (err) {
                console.log("ERror: ", err)
            }
        })
    });


})