let form = document.querySelector('.form');

let signUp = async (email, name, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/user/signup',
      data: { email, name, password, passwordConfirm },
    });
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  console.log(name);
  signUp(email, name, password, passwordConfirm);
});
