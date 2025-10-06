import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testBoredAPI() {
  const urls = [
    'http://www.boredapi.com/api/activity/',
    'https://www.boredapi.com/api/activity/',
    'http://boredapi.com/api/activity/',
    'https://boredapi.com/api/activity/'
  ];

  console.log('🧪 PROBANDO CONEXIÓN CON BORED API...\n');

  for (const url of urls) {
    try {
      console.log(`🔗 Probando: ${url}`);
      const response = await axios.get(url, { timeout: 10000 });
      console.log(`✅ FUNCIONA: ${url}`);
      console.log(`   Actividad: ${response.data.activity}`);
      console.log(`   Tipo: ${response.data.type}`);
      console.log('---');
      return true;
    } catch (error) {
      console.log(`❌ FALLA: ${url}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Código: ${error.code}`);
      console.log('---');
    }
  }

  console.log('❌ Ninguna URL funcionó. Probable problema de conexión a internet.');
  return false;
}

// Probar también con fetch nativo
async function testWithFetch() {
  console.log('\n🧪 Probando con Fetch nativo...');
  try {
    const response = await fetch('https://www.boredapi.com/api/activity/', {
      method: 'GET',
      timeout: 10000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Fetch funciona');
      console.log(`   Actividad: ${data.activity}`);
    } else {
      console.log('❌ Fetch falló:', response.status);
    }
  } catch (error) {
    console.log('❌ Fetch error:', error.message);
  }
}

// Ejecutar pruebas
testBoredAPI().then(success => {
  if (!success) {
    testWithFetch();
  }
});