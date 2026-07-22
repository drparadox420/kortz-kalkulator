function updateCalculations() {
  const crewSize = parseInt(document.getElementById('crew-size').value);
  const crewCards = document.querySelectorAll('.crew-card');
  
  // Auto-lockout crew room inputs on Solo runs
  crewCards.forEach(card => {
    if (crewSize === 1) {
      card.classList.add('card-burned');
      card.querySelectorAll('input').forEach(i => i.value = '');
    } else {
      card.classList.remove('card-burned');
    }
  });

  // Handle Loading Bay Van 3-State Dropdown
  const vanState = document.getElementById('item-van-state').value;
  const vanCustomInput = document.getElementById('item-van-custom');
  if (vanState === 'custom') {
    vanCustomInput.style.display = 'block';
  } else {
    vanCustomInput.style.display = 'none';
  }

  // Calculate Totals
  let totalValue = 0;
  let primaryVal = parseFloat(document.getElementById('item-1').value) || 0;
  totalValue += primaryVal;

  for (let i = 2; i <= 33; i++) {
    let el = document.getElementById('item-' + i);
    if (el && el.value) {
      totalValue += parseFloat(el.value);
    }
  }

  if (vanState === 'default') totalValue += 125000;
  if (vanState === 'custom' && vanCustomInput.value) {
    totalValue += parseFloat(vanCustomInput.value);
  }

  document.getElementById('hud-total').innerText = '$' + totalValue.toLocaleString();
}

function scrollToManifest() {
  document.getElementById('manifest').scrollIntoView({ behavior: 'smooth' });
}

function openEndSessionModal() {
  document.getElementById('end-session-modal').style.display = 'flex';
}

function closeEndSessionModal() {
  document.getElementById('end-session-modal').style.display = 'none';
}

function resetSession() {
  for (let i = 1; i <= 33; i++) {
    let el = document.getElementById('item-' + i);
    if (el) el.value = '';
  }
  document.getElementById('item-van-state').value = 'none';
  document.getElementById('item-van-custom').value = '';
  updateCalculations();
  closeEndSessionModal();
}
