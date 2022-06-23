

const buttonVhod = document.querySelector('.otpravit')



buttonVhod.addEventListener( "click", event => {
    
    const loginInput = document.getElementById('login')
    const password = document.getElementById('password')
   
    getDataByInn(loginInput.value, password.value)

})




const getDataByInn = async (login, password) => {


    const res = await fetch('http://192.168.15.112:5050/admin_enter', {
        method:'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({login:login, password:password})

    })
    
    const json = await res.json()

    if (json === true) {
        window.open('./adminkaMain.html', '_blank')
    }

    

}



