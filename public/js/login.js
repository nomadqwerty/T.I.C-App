let form = document.querySelector('.form');

//Isioma - Notes//
//**** Useful for client side applications calling an API to get resource(e.g React.js), when data is received, you can then act on it */
let login = async (email, password, successUrl) => {
  try {
    const res = await axios({
      method: 'POST',
      // url: 'http://localhost:8080/api/v1/user/login',
      url: 'http://localhost:8080/login',
      data: { email, password, successUrl },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
//Not good for server-side rendered//

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  //login(email, password, successUrl);
  post("/login", { email, password })
});


//Isioma// -> submit a virtually created form to simulate the form submit with correct params
function post(path, params, method='post') {

  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

//Isioma//