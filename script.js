document.getElementById('aadhar').addEventListener('input', function () {
  let digits = this.value.replace(/\D/g, '').slice(0, 12);
  this.value = digits.match(/.{1,4}/g)?.join('-') || digits;
});

function validate() {
  let ok = true;
  document.querySelectorAll('.error').forEach(e => e.textContent = '');

  let firstName  = document.getElementById('firstName').value.trim();
  let lastName   = document.getElementById('lastName').value.trim();
  let dob        = document.getElementById('dob').value;
  let aadhar     = document.getElementById('aadhar').value.replace(/-/g, '');
  let password   = document.getElementById('password').value;
  let confirmPwd = document.getElementById('confirmPwd').value;
  let email      = document.getElementById('email').value.trim();
  let phone      = document.getElementById('phone').value.trim();
  let address    = document.getElementById('address').value.trim();
  let city       = document.getElementById('city').value.trim();
  let state      = document.getElementById('state').value.trim();
  let zip        = document.getElementById('zip').value.trim();

  if(firstName === '')  { document.getElementById('e-firstName').textContent = 'Required'; ok = false; }
  if(lastName === '')   { document.getElementById('e-lastName').textContent = 'Required'; ok = false; }
  if(dob === '')        { document.getElementById('e-dob').textContent = 'Required'; ok = false; }
  if(!document.querySelector('input[name="gender"]:checked')) { document.getElementById('e-gender').textContent = 'Select gender'; ok = false; }
  if(!/^\d{12}$/.test(aadhar)) { document.getElementById('e-aadhar').textContent = 'Enter valid 12-digit Aadhar'; ok = false; }

  if(password.length < 8)    { document.getElementById('e-password').textContent = 'Min 8 characters'; ok = false; }
  if(password !== confirmPwd) { document.getElementById('e-confirmPwd').textContent = 'Passwords do not match'; ok = false; }

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('e-email').textContent = 'Invalid email'; ok = false; }
  if(!/^\d{10}$/.test(phone))  { document.getElementById('e-phone').textContent = 'Invalid phone'; ok = false; }

  if(address === '') { document.getElementById('e-address').textContent = 'Required'; ok = false; }
  if(city === '')    { document.getElementById('e-city').textContent = 'Required'; ok = false; }
  if(state === '')   { document.getElementById('e-state').textContent = 'Required'; ok = false; }
  if(zip === '')     { document.getElementById('e-zip').textContent = 'Required'; ok = false; }

  if(!document.getElementById('consent1').checked) { document.getElementById('e-consent1').textContent = 'Required'; ok = false; }
  if(!document.getElementById('consent2').checked) { document.getElementById('e-consent2').textContent = 'Required'; ok = false; }

  if(ok) {
    document.getElementById('regForm').style.display = 'none';
    document.getElementById('successText').textContent = firstName + ' ' + lastName + ' registered successfully!';
    document.getElementById('successBox').style.display = 'block';
  }

  return false;
}

document.getElementById('regForm').addEventListener('reset', function () {
  setTimeout(() => {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
  }, 0);
});