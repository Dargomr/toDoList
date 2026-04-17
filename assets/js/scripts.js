const list = document.querySelectorAll("li");
list.forEach(async (el) => {
    el.addEventListener("click", async (ev) => {
      if (!ev.target.classList.contains('li__checkbox')) {
        el.classList.toggle("done")
        let liDataDone = {
          done: el.classList.contains('done'),
          uuid: el.dataset.uuid,
        };
        let response = await fetch('/done', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(liDataDone),
        });
      };
    });
})

const checkboxes = document.querySelectorAll('.li__checkbox')
checkboxes.forEach((el) => {
  el.addEventListener('click', async () => {
    liDataCheck = {
      checked: el.checked,
      uuid: el.parentNode.dataset.uuid,
    }
    let response = await fetch('/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(liDataCheck),
    })
  })
})


function removeLi(el) {
  return (
    el.addEventListener('click', async (ev) => {
      el.parentNode.remove();
      let response = await fetch('/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uuid: el.parentNode.dataset.uuid}),
        })
    })
  )
}

const deleteButtons = document.querySelectorAll('.delete-button')
deleteButtons.forEach((el) => {
  removeLi(el);
})

const addLiButton = document.querySelector('.add-li-button');
const toDoUl = document.querySelector('.to-do__ul');
const inputField = document.querySelector('.input-field');
const errorMsg = document.querySelector('.error-msg');

inputAdd.onsubmit = async (e) => {
  e.preventDefault();

  if (inputField.value !== '') {
    const liItem = document.createElement('li');
    const checkbox = createCheckbox();
    liItem.appendChild(checkbox);
    const button = document.createElement('button');
    liItem.appendChild(button);
    button.classList.add('delete-button');
    button.innerHTML = 'удалить';
    removeLi(button);
    // liItem.append(inputField.value);
    const textNode = document.createElement('p');
    textNode.textContent = inputField.value;
    liItem.appendChild(textNode);
    toDoUl.appendChild(liItem);
    liItem.addEventListener("click", (ev) => {
      if (!ev.target.classList.contains('li__checkbox')) {
        liItem.classList.toggle("done")
      }
      
    });
    errorMsg.classList.remove('error-msg_active');
    
    let response = await fetch('/add',  {
      method: 'POST',
      body: new FormData(inputAdd),
    })
    if (!response.ok) {
      console.error('Ошибка:', response.status)
      return
    }
    response = await response.json();
    liItem.dataset.uuid = response.uuid


  } else {
    errorMsg.classList.add('error-msg_active');
  }
}

function createCheckbox() {
  const checkout = document.createElement('input');
  checkout.type = 'checkbox';
  checkout.classList.add('li__checkbox')
  return checkout;

}

const deleteAllChecked = document.querySelector('.delete-all-checked');
const completeAllChecked = document.querySelector('.complete-all-checked');

const listCheckBoxes = document.getElementsByClassName("li__checkbox");

deleteAllChecked.addEventListener("click", async () => {
  let uuids = [];
  Array.from(document.getElementsByClassName("li__checkbox")).forEach((el) => {
    if (el.checked) {
      uuids.push(el.parentNode.dataset.uuid)
      el.parentNode.remove();
    }
  })
  let response = await fetch('/deleteAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({uuids: uuids}),
  })
})

completeAllChecked.addEventListener('click', async () => {
  let mas = [];
  Array.from(document.getElementsByClassName('li__checkbox')).forEach((el) => {
    if(el.checked) {
      mas.push(el.parentNode.dataset.uuid, el.parentNode.classList.contains('done'))
      el.parentNode.classList.add('done')
    }
  })
  let response = await fetch('/completeAll', {
    method: 'POST',
  })
})



