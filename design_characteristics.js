function show_materials(){
    if(document.getElementById("content").style.display === "block"){
        document.getElementById("content").style.display = "none";
        document.getElementById("drop_button").innerHTML = 'Выбрать материал ▼';
    }
    else{
        document.getElementById("content").style.display = "block";
        document.getElementById("drop_button").innerHTML = 'Выбрать материал ▲';
    }
} 
function set_material(id){
    document.getElementById('elastic_modulus').value = material_values[id];
}

var k = 0
for(let material of material_names) {
    div = document.createElement('div');
    div.innerHTML = material;
    div.setAttribute('class', 'material_name');
    div.setAttribute('id', k);
    div.setAttribute('onClick', 'set_material(this.id)');
    document.getElementById("content").appendChild(div);
    k++;
}

function filter_materals(){
    input = document.getElementById("search_list");
    material_arr = document.getElementsByClassName("material_name");
    for (i = 0; i < material_arr.length; i++) {
        if (material_arr[i].innerHTML.toUpperCase().indexOf(input.value.toUpperCase()) > -1) {
            material_arr[i].style.display = "block";
        } 
        else material_arr[i].style.display = "none";
    }
} 

var design_y = 1300;
document.getElementById('i-beam').onclick = () => {
    init();
    balk.draw_line(0, design_y, x2 + x2 / 0.9, design_y);
    let Wz = Math.abs(max(x_moments)) * 1000 / get_value('bend_resistance');

    for(i in resistance_moment_b){
        if(Wz < resistance_moment_b[i]['W']){
            text = 'Из условий прочности по нормальным и касательным напряжениям принято: ';
            balk.draw_text(50, 50, design_y + 20, text, 'black', 14, 'left');

            text = 'Wz ≥ ' + Wz.toFixed(2).toString();
            balk.draw_text(x1, x1, design_y + 40, text, 'black', 14, 'left');

            tau_max = Math.abs(max(x_forces)) * square_b[i]['S'] / inertia_moment_b[i]['I'] / wall_thickness_b[i]['b'] * 100;
            text = 'для сечения балки ⌶ №'+ (number_b[i]['Number']).toString() + ': '+'Wz = ' + (resistance_moment_b[i]['W']).toString() + 
                ' см³' + ', ' + 'Iz = ' + (inertia_moment_b[i]['I']).toString() + ' см⁴,' + ' TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа.';
            balk.draw_text(x1, x1, design_y + 60, text, 'black', 14, 'left');
            
            if(tau_max < get_value('slice_resistance')){
                text = 'Условие прочности TAUmax < ' + get_value('slice_resistance').toString() + ' МПа' + ' соблюдается;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
                strength_condition = true;
            }
            else if(tau_max >= get_value('slice_resistance')){
                text = 'TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа ' + ' > ' + get_value('slice_resistance').toString() + 
                    ' МПа' + ' - условие прочности не выполняется;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
            }
            break;
        }
    }
    Iz = Math.abs(max(lindisp)) * 100 / get_value('elastic_modulus') / get_value('standard_deflection');
    for(i in inertia_moment_b){
        if(Iz < inertia_moment_b[i]['I']){
            text = 'По условию жесткости принято: ';
            balk.draw_text(50, 50, design_y + 100, text, 'black', 14, 'left');

            text = 'Iz ≥ ' + Iz.toFixed(2).toString() + ' см⁴;'
            balk.draw_text(x1, x1, design_y + 120, text, 'black', 14, 'left');

            text = 'для сечение балки ⌶ №'+ (number_b[i]['Number']).toString() + ': Wz = ' + (resistance_moment_b[i]['W']).toString() + ' см³' + 
                ', ' + 'Iz = ' + (inertia_moment_b[i]['I']).toString() + ' см⁴' + ', ' + 'A = ' + (sectional_area_b[i]['A']).toString() + ' см²' + '.';
            balk.draw_text(x1, x1, design_y + 140, text, 'black', 14, 'left');
            break;
        }
    }
}
document.getElementById('channel1').onclick = () => {
    init();
    balk.draw_line(0, design_y, x2 + x2 / 0.9, design_y);
    let Wz = Math.abs(max(x_moments)) * 1000 / get_value('bend_resistance');
    for(i in resistance_moment_c){
        if(Wz / 2 < resistance_moment_c[i]['W']){
            text = 'Из условий прочности по нормальным  касательным и напряжениям принято: ';
            balk.draw_text(50, 50, design_y + 20, text, 'black', 14, 'left');

            text = 'Wz ≥ ' + Wz.toFixed(2).toString();
            balk.draw_text(x1, x1, design_y + 40, text, 'black', 14, 'left');
            
            tau_max = (Math.abs(max(x_forces)) * square_c[i]['S']) / (inertia_moment_c[i]['I'] / wall_thickness_c[i]['b']);
            text = 'для сечения балки ⊐⊏ №'+ (number_c[i]['Number']).toString() + ': '+'Wz = ' + (resistance_moment_c[i]['W']).toString() + 
                ' см³' + ', ' + 'Iz = ' + (inertia_moment_c[i]['I']).toString() + ' см⁴,' + ' TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа.';
            balk.draw_text(x1, x1, design_y + 60, text, 'black', 14, 'left');
            
            if(tau_max < get_value('slice_resistance')){
                text = 'Условие прочности TAUmax < ' + get_value('slice_resistance').toString() + ' МПа' + ' соблюдается;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
            }
            else if(tau_max2 >= get_value('slice_resistance')){
                text = 'TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа ' + ' > ' + get_value('slice_resistance').toString() + 
                    ' МПа' + ' - условие прочности не выполняется;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
            }
            break;
        }
    }
    Iz = Math.abs(max(lindisp)) * 100 / get_value('elastic_modulus') / get_value('standard_deflection');
    for(i in inertia_moment_c){
        if(Iz / 2 < inertia_moment_c[i]['I']){
            text = 'По условию жесткости принято: ';
            balk.draw_text(50, 50, design_y + 100, text, 'black', 14, 'left');

            text = 'Iz ≥ ' + Iz.toFixed(2).toString() + ' см⁴;'
            balk.draw_text(x1, x1, design_y + 120, text, 'black', 14, 'left');

            text = 'для сечение балки ⊐⊏ №'+ (number_c[i]['Number']).toString() + ': Wz = ' + (resistance_moment_c[i]['W']).toString() + ' см³' + 
                ', ' + 'Iz = ' + (inertia_moment_c[i]['I']).toString() + ' см⁴' + ', ' + 'A = ' + (sectional_area_c[i]['A']).toString() + ' см²' + '.';
            balk.draw_text(x1, x1, design_y + 140, text, 'black', 14, 'left');
            break;
        }
    }
}

document.getElementById('channel2').onclick = () => {
    init();
    balk.draw_line(0, design_y, x2 + x2 / 0.9, design_y);
    let Wz = Math.abs(max(x_moments)) * 1000 / get_value('bend_resistance');
    for(i in resistance_moment_c){
        if(Wz / 2 < resistance_moment_c[i]['W']){
            text = 'Из условий прочности по нормальным  касательным и напряжениям принято: ';
            balk.draw_text(50, 50, design_y + 20, text, 'black', 14, 'left');

            text = 'Wz ≥ ' + Wz.toFixed(2).toString();
            balk.draw_text(x1, x1, design_y + 40, text, 'black', 14, 'left');
            
            tau_max = (Math.abs(max(x_forces)) * square_c[i]['S']) / (inertia_moment_c[i]['I'] / wall_thickness_c[i]['b']);
            text = 'для сечения балки ⊏⊐ №'+ (number_c[i]['Number']).toString() + ': '+'Wz = ' + (resistance_moment_c[i]['W']).toString() + 
                ' см³' + ', ' + 'Iz = ' + (inertia_moment_c[i]['I']).toString() + ' см⁴,' + ' TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа.';
            balk.draw_text(x1, x1, design_y + 60, text, 'black', 14, 'left');
            
            if(tau_max < get_value('slice_resistance')){
                text = 'Условие прочности TAUmax < ' + get_value('slice_resistance').toString() + ' МПа' + ' соблюдается;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
            }
            else if(tau_max2 >= get_value('slice_resistance')){
                text = 'TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа ' + ' > ' + get_value('slice_resistance').toString() + 
                    ' МПа' + ' - условие прочности не выполняется;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
            }
            break;
        }
    }
    Iz = Math.abs(max(lindisp)) * 100 / get_value('elastic_modulus') / get_value('standard_deflection');
    for(i in inertia_moment_c){
        if(Iz / 2 < inertia_moment_c[i]['I']){
            text = 'По условию жесткости принято: ';
            balk.draw_text(50, 50, design_y + 100, text, 'black', 14, 'left');

            text = 'Iz ≥ ' + Iz.toFixed(2).toString() + ' см⁴;'
            balk.draw_text(x1, x1, design_y + 120, text, 'black', 14, 'left');

            text = 'для сечение балки ⊏⊐ №'+ (number_c[i]['Number']).toString() + ': Wz = ' + (resistance_moment_c[i]['W']).toString() + ' см³' + 
                ', ' + 'Iz = ' + (inertia_moment_c[i]['I']).toString() + ' см⁴' + ', ' + 'A = ' + (sectional_area_c[i]['A']).toString() + ' см²' + '.';
            balk.draw_text(x1, x1, design_y + 140, text, 'black', 14, 'left');
            break;
        }
    }
}

document.getElementById('rectangle').onclick = () => {
    init();
    balk.draw_line(0, design_y, x2 + x2 / 0.9, design_y);
    let Wz = Math.abs(max(x_moments)) * 1000 / get_value('bend_resistance');
    let b = Math.pow(Wz * 6 / Math.pow(get_value('hb_ratio'), 2), 1/3);
    let h = get_value('hb_ratio') * b;
    let A = h * b;
    let Iz = b * Math.pow(h, 3) / 12;
    let Sz = b * Math.pow(h, 2) / 8;

    for(i in resistance_moment_c){
        if(Wz / 2 < resistance_moment_c[i]['W']){
            text = 'Из условий прочности по нормальным и касательным напряжениям принято: ';
            balk.draw_text(50, 50, design_y + 20, text, 'black', 14, 'left');

            text = 'Wz ≥ ' + Wz.toFixed(2).toString() + ', b = ' + b.toFixed(2).toString() + ' см' + ', h = ' + 
                h.toFixed(2).toString() + ' см' + ', A = ' + A.toFixed(2).toString() + ' см²;';
            balk.draw_text(x1, x1, design_y + 40, text, 'black', 14, 'left');

            tau_max = Math.abs(max(x_forces)) * Sz * 10 / Iz / b;
            text = 'для прямоугольного сечения: ' + 'TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа ';
            balk.draw_text(x1, x1, design_y + 60, text, 'black', 14, 'left');
            
            if(tau_max < get_value('slice_resistance')){
                text = 'Условие прочности TAUmax < ' + get_value('slice_resistance').toString() + ' МПа' + ' соблюдается для каждого типа сечения;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
            }
            else if(tau_max >= get_value('slice_resistance')){
                text = 'TAUmax = ' + (tau_max).toFixed(2).toString() + ' МПа ' + ' > ' + get_value('slice_resistance').toString() + 
                    ' МПа' + ' - условие прочности не выполняется;';
                balk.draw_text(50, 50, design_y + 80, text, 'black', 14, 'left');
            }
            break;
        }
    }
    Iz = Math.abs(max(lindisp)) * 100 / get_value('elastic_modulus') / get_value('standard_deflection');
    for(i in inertia_moment_c){
        if(Iz / 2 < inertia_moment_c[i]['I']){
            text = 'По условию жесткости принято: ';
            balk.draw_text(50, 50, design_y + 100, text, 'black', 14, 'left');

            text = 'Iz ≥ ' + Iz.toFixed(2).toString() + ' см⁴;'
            balk.draw_text(x1, x1, design_y + 120, text, 'black', 14, 'left');

            text = 'для прямоугольного поперечного сечения:';
            balk.draw_text(x1, x1, design_y + 140, text, 'black', 14, 'left');

            b = Math.pow(Iz * 12 / Math.pow(get_value('hb_ratio'), 3), 1/4);
            h = get_value('hb_ratio') * b;
            A = h * b;
            Wz = b * Math.pow(h, 2) / 6;
            text = 'Iz ≥ ' + Iz.toFixed(2).toString() + ' см⁴ - b = ' + b.toFixed(2).toString() + ' см, h = ' + 
                h.toFixed(2).toString() + ' см, A = ' + A.toFixed(2).toString() + ' см², Wz = ' + Wz.toFixed(2).toString() + 'см³;';
                balk.draw_text(x1, x1, design_y + 160, text, 'black', 14, 'left');
            break;
        }
    }
}

if(show_disclaimer == 0){
    document.getElementById("disclaimer").style.display = "none";
    document.getElementsByClassName("nav")[0].style.filter = 'none';
    document.getElementsByClassName("nav")[0].style.pointerEvents =  'auto';
}
else{
    document.getElementById("disclaimer").style.display = 'flex';
    document.getElementsByClassName("nav")[0].style.filter = 'blur(10px)'
    document.getElementsByClassName("nav")[0].style.pointerEvents =  'none';
}
