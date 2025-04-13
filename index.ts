// Import stylesheets
import './style.css';


const form = document.createElement("form");

form.onsubmit = (_) => {
  const formData = new FormData(form);

  console.log(formData);
  const text = formData.get('defineword') as string;
  console.log(text);
  return false; // prevent reload
};

