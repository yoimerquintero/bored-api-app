import dotenv from 'dotenv';
dotenv.config();

import sequelize from './config/database.js';
import Actividad from './models/Actividad.js';

async function resetActividades() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Contar actividades antes
    const countBefore = await Actividad.count();
    console.log(`📊 Actividades antes: ${countBefore}`);

    if (countBefore > 0) {
      // Borrar todas las actividades
      const deletedCount = await Actividad.destroy({
        where: {},
        truncate: false
      });
      console.log(`🗑️ Se borraron ${deletedCount} actividades`);
    } else {
      console.log('ℹ️ No hay actividades para borrar');
    }

    // Contar actividades después
    const countAfter = await Actividad.count();
    console.log(`📊 Actividades después: ${countAfter}`);

    console.log('✅ Base de datos reiniciada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al reiniciar base de datos:', error);
    process.exit(1);
  }
}
// Función para reiniciar todas las actividades
async function resetActivities() {
    if (!confirm('⚠️ ¿Estás seguro de que quieres borrar TODAS las actividades?\n\nEsta acción no se puede deshacer.')) {
        return;
    }

    const resultsDiv = document.getElementById('filter-results');
    resultsDiv.innerHTML = '<div class="loading">Borrando todas las actividades...</div>';
    
    try {
        const response = await fetch('/api/actividades/reset', {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultsDiv.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #4CAF50;">
                    ✅ ${data.message}
                    <br><small>Las actividades han sido borradas correctamente.</small>
                </div>
            `;
            // Actualizar estadísticas
            updateStats();
        } else {
            resultsDiv.innerHTML = `<div style="color: #ff6b6b; text-align: center; padding: 20px;">❌ Error: ${data.error}</div>`;
        }
    } catch (error) {
        resultsDiv.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; padding: 20px;">
                ❌ Error de conexión: ${error.message}
            </div>
        `;
    }
}

resetActividades();