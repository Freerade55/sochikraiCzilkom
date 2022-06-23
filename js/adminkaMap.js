

const select = document.getElementById('select')
const coordsAll = []
let checkName = ''
const dataZayavki = document.getElementById('dataZayavki')
const dateToday = new Date()
dataZayavki.value = dateToday.toLocaleDateString()

const getDataByInn = async () => {


    const res = await fetch('http://127.0.0.1:5000/select', {
        method:'GET',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
       

    })
    
    const json = await res.json()

    json.forEach(x => {
        const newOption = document.createElement('option')
        newOption.innerHTML = x[1]
        newOption.setAttribute('id', `${x[0]}`)
        select.appendChild(newOption)
    })



    // getOptions()

}

getDataByInn()





// const getOptions = () => {

//     const allOptions = document.querySelectorAll('option')   потом добавить, когда буду делать показ заданий
//     select.addEventListener( "click", event => {
       
//         if(select.value !== 'Выберите Исполнителя') {

//             if(checkName !== select.value) {
//                 checkName = select.value
//                 allOptions.forEach(x=>{
//                     if(x.innerText === select.value) {
//                         getTasks(x.id)

//                     }
//                 })
//             }
//         }


//     })
// }



    
// const getTasks = async (id) => {


    
//     const res = await fetch('http://127.0.0.1:5000/TableTasks', {
//         method:'POST',
//         headers: {
//             'content-type': 'application/json;charset=utf-8'
//         },
//         body: JSON.stringify(id)

//     })
    
//     const json = await res.json()
//     console.log(json)




// }








ymaps.ready(init);

function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            center: [43.5991700, 39.7256900],
            zoom: 14,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });



        myPlacemark = createPlacemark([43.5991700, 39.7256900]);
        myMap.geoObjects.add(myPlacemark);
        
    // Слушаем клик на карте.
       
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        // Если метка уже создана – просто передвигаем ее.
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
            myPlacemark.events.add('dragend', function () {
                
                getAddress(myPlacemark.geometry.getCoordinates());
            });
      
        }
        // Если нет – создаем.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
    });




    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }
    
    myPlacemark.events.add('dragend', function () {
        getAddress(myPlacemark.geometry.getCoordinates());
    });


    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
       
        myPlacemark.properties.set('iconCaption', 'поиск...');

        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });

               
    writeAddress(coords, myPlacemark.properties['_data'].balloonContent)
                
    });
    
  
   
    }

}


const writeAddress = async (coords, address) => {
    if (address != undefined) {
    const addressInput = document.getElementById('address')
    let array = address.split(',')
    let res = []
    array = array.map(function (el) {
        return el.trim();
      }); 

    array.forEach(x => {
        if (x !== 'Россия' && x !== 'Краснодарский край' && x !== 'Сочи')
        {
            res.push(x)
        }
    })
    
    res = res.join(', ')
   
    addressInput.value = res
    coordsAll.push(coords)
    

}
    }



const getButton = document.getElementById('otpravka')

getButton.addEventListener( "click", event => {

const allInputs = document.querySelectorAll('input')
const getSelect = document.getElementById('select')

if (getSelect.value === 'Выберите Исполнителя') {
    alert('Выберите Исполнителя!')
    
}else{


const toBd = {}
toBd[`ispolnitel`] = getSelect.value
toBd[`coords`] = coordsAll.slice(-1)

allInputs.forEach(x => {
    toBd[`${x.id}`] = x.value
})


for(let value in select.children) {

    if(select.children[value].innerHTML === getSelect.value) {
        toBd[`ispolnitelId`] = select.children[value].id

    }
}


taskAdd(toBd)

const getTbody = document.getElementsByTagName('tbody')

console.log(getTbody)


const tr = document.createElement('tr')
const fragment = document.createDocumentFragment()
let sortArray = []

sortArray.push(toBd.nomerZayavki, toBd.dataZayavki, toBd.srokIspolnenya, toBd.ispolnitel, toBd.object, toBd.address, toBd.zadachi, 
toBd.contacts, toBd.initiator, toBd.comment, 'Не выполнено')
   
sortArray.forEach(x=>{
    const td = document.createElement('td')
    td.innerText = x
    fragment.appendChild(td)

})

tr.appendChild(fragment)
getTbody[0].appendChild(tr)


getSelect.value = 'Выберите Исполнителя'
dataZayavki.value = dateToday.toLocaleDateString()
allInputs.forEach(x => {
    if(x.value !== dateToday.toLocaleDateString()) {
        x.value = ''
    }
    
})


}


})




const taskAdd = async (toBd) => {


    
    const res = await fetch('http://127.0.0.1:5000/getTask', {
        method:'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(toBd)

    })
    




}










    