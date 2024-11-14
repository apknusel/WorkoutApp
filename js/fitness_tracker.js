function addExercise() {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise');

    exerciseDiv.innerHTML = `
      <input type="text" placeholder="Exercise">
      <input type="number" placeholder="Reps">
      <input type="number" placeholder="75%" disabled>
      <input type="number" placeholder="120bpm" disabled>
      <input type="number" placeholder="98%" disabled>
      <input type="text" placeholder="1:00.52s" disabled>
      <button onclick="toggleSelect(this)"> Select </button>
    `;

    document.getElementById('exercises').appendChild(exerciseDiv);
}

function toggleSelect(button) {
    if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        button.textContent = 'Select';
    } else {
        button.classList.add('selected');
        button.textContent = 'Selected';
    }
}
