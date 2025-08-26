// Asegurarse de que el DOM esté completamente cargado antes de asignar eventos
document.addEventListener('DOMContentLoaded', function() {
    const formElement = document.getElementById('dietForm');
    const resetButton = document.getElementById('reset');
    const resultDiv = document.getElementById('result');

    console.log('Form element:', formElement);
    if (!formElement) {
        console.error('Error: No se encontró un elemento con ID "dietForm".');
        return;
    }

    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        generateDiet();
    });

    resetButton.addEventListener('click', function() {
        console.log('Reset button clicked');
        try {
            formElement.reset();
            resultDiv.innerHTML = '';
            console.log('Form reset and result cleared successfully');
        } catch (error) {
            console.error('Error al usar form.reset:', error);
            const inputs = formElement.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            resultDiv.innerHTML = '';
            console.log('Fallback: Form fields reset manually and result cleared');
        }
    });
});

// Función para determinar la temporada basada en la fecha actual
function getSeason() {
    const month = new Date().getMonth() + 1; // 0-11 a 1-12
    if ([12, 1, 2].includes(month)) return 'summer';
    if ([3, 4, 5].includes(month)) return 'autumn';
    if ([6, 7, 8].includes(month)) return 'winter';
    if ([9, 10, 11].includes(month)) return 'spring';
}

// Función para mezclar un arreglo (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Simulación de consulta a Grok como base de datos dinámica
function fetchFoodsFromGrok(category, location, season, dietType, conditions, allergies) {
    const baseFoods = {
        carbs: { all: [], breakfast: [] },
        proteins: { all: [], breakfast: [] },
        vegetables: [],
        fruits: [],
        snacks: []
    };

    const locationData = {
        santiago: {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Sandías'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Brócoli', 'Coliflor'],
                fruits: ['Naranjas', 'Limones', 'Manzanas', 'Pomelos'],
                snacks: ['Almendras', 'Nueces', 'Higos secos']
            }
        },
        concepcion: {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Arándanos'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Coliflor', 'Espinacas'],
                fruits: ['Naranjas', 'Kiwi', 'Manzanas', 'Pomelos'],
                snacks: ['Nueces', 'Pasas', 'Higos secos']
            }
        },
        'vina-del-mar': {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pescado', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pescado', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Sandías'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pescado', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pescado', 'Lentejas', 'Mariscos', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Espinacas', 'Coliflor'],
                fruits: ['Naranjas', 'Limones', 'Pomelos', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Higos secos']
            }
        },
        'la-serena': {
            spring: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Maíz'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Espárragos', 'Zanahorias', 'Brócoli', 'Lechuga'],
                fruits: ['Fresas', 'Ciruelas', 'Manzanas', 'Naranjas'],
                snacks: ['Almendras', 'Pasas', 'Semillas de girasol']
            },
            summer: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Tomates', 'Pepinos', 'Pimientos', 'Zucchini'],
                fruits: ['Cerezas', 'Duraznos', 'Melones', 'Mandarinas'],
                snacks: ['Nueces', 'Frutos secos mixtos', 'Chips de manzana']
            },
            autumn: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Calabazas', 'Zanahorias', 'Remolachas', 'Coles'],
                fruits: ['Uvas', 'Peras', 'Manzanas', 'Kiwi'],
                snacks: ['Almendras', 'Ciruelas secas', 'Avellanas']
            },
            winter: {
                carbs: { all: ['Arroz', 'Papas', 'Quinoa', 'Trigo'], breakfast: ['Avena', 'Pan integral'] },
                proteins: { all: ['Pollo', 'Lentejas', 'Pescado', 'Carne magra'], breakfast: ['Huevos', 'Queso fresco'] },
                vegetables: ['Repollos', 'Zanahorias', 'Betarragas', 'Coliflor'],
                fruits: ['Naranjas', 'Limones', 'Mandarinas', 'Pomelos'],
                snacks: ['Nueces', 'Higos secos', 'Semillas de calabaza']
            }
        }
    };

    let foods = locationData[location][season] || locationData.santiago[season];

    // Filtrar según dieta, condiciones y alergias
    if (dietType === 'vegetarian') {
        foods.proteins.all = foods.proteins.all.filter(p => !['Pollo', 'Pescado', 'Mariscos', 'Carne magra'].includes(p));
        foods.proteins.breakfast = foods.proteins.breakfast.filter(p => !['Pollo', 'Pescado', 'Mariscos', 'Carne magra'].includes(p));
    }
    if (dietType === 'vegan') {
        foods.proteins.all = ['Lentejas', 'Garbanzos'];
        foods.proteins.breakfast = [];
        foods.snacks = foods.snacks.filter(s => !['Almendras', 'Nueces', 'Queso fresco', 'Huevos'].includes(s));
    }
    if (conditions.includes('lactose')) {
        foods.proteins.all = foods.proteins.all.filter(p => p !== 'Queso fresco' && p !== 'Huevos');
        foods.proteins.breakfast = foods.proteins.breakfast.filter(p => p !== 'Queso fresco' && p !== 'Huevos');
    }
    if (conditions.includes('celiac')) {
        foods.carbs.all = foods.carbs.all.filter(c => c !== 'Trigo' && c !== 'Pan integral');
        foods.carbs.breakfast = foods.carbs.breakfast.filter(c => c !== 'Trigo' && c !== 'Pan integral');
    }
    if (allergies) {
        const allergyList = allergies.split(',').map(a => a.trim());
        for (let cat in foods) {
            if (cat === 'carbs' || cat === 'proteins') {
                foods[cat].all = foods[cat].all.filter(f => !allergyList.includes(f));
                foods[cat].breakfast = foods[cat].breakfast.filter(f => !allergyList.includes(f));
            } else {
                foods[cat] = foods[cat].filter(f => !allergyList.includes(f));
            }
        }
    }

    // Mezclar los arreglos para evitar repeticiones
    for (let cat in foods) {
        if (cat === 'carbs' || cat === 'proteins') {
            foods[cat].all = shuffleArray([...foods[cat].all]);
            foods[cat].breakfast = shuffleArray([...foods[cat].breakfast]);
        } else {
            foods[cat] = shuffleArray([...foods[cat]]);
        }
    }

    return foods;
}

function calculateBMR(sex, weight, height, age) {
    if (sex === 'male') return 10 * weight + 6.25 * height - 5 * age + 5;
    return 10 * weight + 6.25 * height - 5 * age - 161;
}

function getActivityMultiplier(activity) {
    const levels = { low: 1.2, light: 1.375, moderate: 1.55, high: 1.725, intense: 1.9 };
    return levels[activity] || 1.2;
}

function adjustCalories(bmr, goal) {
    if (goal === 'lose') return bmr - 500;
    if (goal === 'gain') return bmr + 500;
    return bmr;
}

function generateDiet() {
    const name = document.getElementById('name').value;
    const sex = document.getElementById('sex').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseInt(document.getElementById('height').value);
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;
    const conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(c => c.value);
    const allergies = document.getElementById('allergies').value;
    const dietType = document.getElementById('dietType').value;
    const location = document.getElementById('location').value;
    const meals = Array.from(document.querySelectorAll('input[name="meal"]:checked')).map(m => m.value);
    const days = parseInt(document.getElementById('days').value);
    const season = getSeason();

    if (weight < 30 || weight > 200 || height < 100 || height > 250 || age < 10 || age > 100) {
        document.getElementById('result').innerHTML = '<p class="alert">Tu caso requiere la asistencia de un especialista.</p>';
        return;
    }

    const bmr = calculateBMR(sex, weight, height, age);
    const tdee = bmr * getActivityMultiplier(activity);
    const calories = adjustCalories(tdee, goal);
    const mainMeals = meals.filter(m => !['firstSnack', 'secondSnack'].includes(m));
    const snackMeals = meals.filter(m => ['firstSnack', 'secondSnack'].includes(m)).length;

    // Definir bandas de proporciones fijas
    const baseProportions = {
        breakfast: { min: 0.20, ideal: 0.25 },
        lunch: { min: 0.30, ideal: 0.35 },
        dinner: { min: 0.20, ideal: 0.30 }
    };
    const maxMainProportion = 0.90; // Máximo 90% para comidas principales
    const snackBaseCalories = 100; // 100 kcal por snack
    const snackProportion = Math.min(0.10, Math.max(0.05, snackMeals * 0.05)); // 5%-10% total
    const snackCalories = Math.round(calories * snackProportion); // Calorías totales para snacks
    const remainingCalories = calories - snackCalories; // Calorías restantes para comidas principales y margen

    // Calcular proporciones ajustadas según comidas seleccionadas
    let adjustedProportions = {};
    let totalMainProportion = 0;
    if (mainMeals.length > 0) {
        // Asignar proporciones ideales a las comidas seleccionadas
        mainMeals.forEach(meal => {
            if (baseProportions[meal]) {
                adjustedProportions[meal] = baseProportions[meal].ideal;
            }
        });
        totalMainProportion = Object.values(adjustedProportions).reduce((sum, prop) => sum + prop, 0);

        // Ajustar para respetar la banda y el máximo 90%
        if (totalMainProportion > maxMainProportion) {
            const scale = maxMainProportion / totalMainProportion;
            for (let meal in adjustedProportions) {
                adjustedProportions[meal] *= scale;
                // Asegurar mínimos
                adjustedProportions[meal] = Math.max(baseProportions[meal].min, adjustedProportions[meal]);
            }
            totalMainProportion = Object.values(adjustedProportions).reduce((sum, prop) => sum + prop, 0);
        } else if (totalMainProportion < maxMainProportion) {
            // Si faltan comidas, el resto va al margen flexible (máximo 10%)
            const flexMargin = Math.min(0.10, maxMainProportion - totalMainProportion);
            totalMainProportion += flexMargin; // Ajustar total incluyendo margen
        }
    } else {
        // Si no hay comidas principales, todo va al margen flexible (máximo 10%)
        totalMainProportion = 0;
        adjustedProportions = {};
    }

    // Calcular calorías para comidas principales
    const totalMainCalories = Math.round(remainingCalories * (totalMainProportion / (1 - snackProportion)));
    const flexMarginCalories = Math.round(calories * (1 - totalMainProportion - snackProportion)); // 0%-10%

    const availableFoods = fetchFoodsFromGrok(null, location, season, dietType, conditions, allergies);
    console.log('availableFoods:', availableFoods); // Depuración para verificar datos

    // Verificar que availableFoods tenga snacks
    if (!availableFoods.snacks || availableFoods.snacks.length === 0) {
        console.error('Error: No se encontraron snacks en availableFoods');
        availableFoods.snacks = ['Almendras']; // Valor por defecto si falla
    }

    // Contadores para rotación de alimentos
    let counters = {
        carbs: { all: 0, breakfast: 0 },
        proteins: { all: 0, breakfast: 0 },
        vegetables: 0,
        fruits: 0,
        snacks: 0
    };

    let result = `
        <h2>Plan de Dieta para ${name}</h2>
        <p class="summary"><strong>Días Totales:</strong> ${days} | <strong>Calorías Diarias:</strong> ${Math.round(calories)} kcal | <strong>Temporada:</strong> ${season.charAt(0).toUpperCase() + season.slice(1)} | <strong>Ciudad:</strong> ${location.replace('-', ' ').charAt(0).toUpperCase() + location.replace('-', ' ').slice(1)}</p>
        <div class="diet-plan">
    `;

    for (let day = 1; day <= days; day++) {
        const dayClass = day % 2 === 0 ? 'day-even' : 'day-odd';
        result += `
            <section class="day-section ${dayClass}">
                <h3>Día ${day}</h3>
                <div class="meal-grid">
        `;
        meals.forEach(meal => {
            const isBreakfast = meal === 'breakfast';
            const isSnack = meal === 'firstSnack' || meal === 'secondSnack';
            let mealCalories;
            if (isSnack) {
                mealCalories = snackCalories / snackMeals || snackBaseCalories; // Dividir entre número de snacks
            } else {
                const proportion = adjustedProportions[meal] || 0;
                mealCalories = proportion > 0 ? Math.round(totalMainCalories * (proportion / totalMainProportion)) : 0;
                // Asegurar mínimo si está seleccionado
                if (proportion > 0 && mealCalories < Math.round(remainingCalories * baseProportions[meal].min)) {
                    mealCalories = Math.round(remainingCalories * baseProportions[meal].min);
                }
            }
            const scaleFactor = mealCalories / 626; // Base de 626 kcal

            result += `
                <div class="meal-card ${isSnack ? 'snack-card' : ''}">
                    <h4>${meal.charAt(0).toUpperCase() + meal.slice(1)} (~${mealCalories} kcal)</h4>
                    <table class="meal-table">
            `;

            if (isSnack) {
                const snacks = availableFoods.snacks || ['Almendras'];
                const snack = snacks[counters.snacks % snacks.length];
                counters.snacks++;
                result += `
                    <tr><td>Snack:</td><td>${snack} - 30g</td></tr>
                `;
            } else {
                const carbs = isBreakfast ? availableFoods.carbs.breakfast || [] : availableFoods.carbs.all || [];
                const proteins = isBreakfast ? availableFoods.proteins.breakfast || [] : availableFoods.proteins.all || [];
                const vegetables = availableFoods.vegetables || [];
                const fruits = availableFoods.fruits || [];

                const carbQty = Math.round((isBreakfast ? 50 : 100) * scaleFactor);
                const proteinQty = Math.round((isBreakfast ? 30 : 80) * scaleFactor);
                const vegQty = Math.round(100 * scaleFactor);
                const fruitQty = Math.round(150 * scaleFactor);

                const carb = carbs.length > 0 ? carbs[counters.carbs[isBreakfast ? 'breakfast' : 'all'] % carbs.length] : 'Sin carbohidrato';
                const protein = proteins.length > 0 ? proteins[counters.proteins[isBreakfast ? 'breakfast' : 'all'] % proteins.length] : 'Sin proteína';
                const vegetable = vegetables.length > 0 ? vegetables[counters.vegetables % vegetables.length] : 'Sin vegetal';
                const fruit = fruits.length > 0 ? fruits[counters.fruits % fruits.length] : 'Sin fruta';

                counters.carbs[isBreakfast ? 'breakfast' : 'all']++;
                counters.proteins[isBreakfast ? 'breakfast' : 'all']++;
                counters.vegetables++;
                counters.fruits++;

                result += `
                    <tr><td>Carbohidratos:</td><td>${carb} - ${carbQty}g</td></tr>
                    <tr><td>Proteínas:</td><td>${protein} - ${proteinQty}g</td></tr>
                    <tr><td>Vegetales:</td><td>${vegetable} - ${vegQty}g</td></tr>
                    <tr><td>Frutas:</td><td>${fruit} - ${fruitQty}g</td></tr>
                `;
            }
            result += `
                    </table>
                </div>
            `;
        });
        // Mostrar margen flexible si existe
        if (flexMarginCalories > 0) {
            result += `
                <div class="meal-card">
                    <h4>Margen Flexible (~${flexMarginCalories} kcal)</h4>
                    <table class="meal-table">
                        <tr><td>Nota:</td><td>Calorías no asignadas, disponibles para ajustes.</td></tr>
                    </table>
                </div>
            `;
        }
        result += `
                </div>
            </section>
        `;
    }

    result += `</div>`;
    document.getElementById('result').innerHTML = result;
}
