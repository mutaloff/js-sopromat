function setupCanvas(cnvs) {
    var dpr = window.devicePixelRatio || 1;
    var rect = cnvs.getBoundingClientRect();
    cnvs.width = rect.width * dpr;
    cnvs.height = rect.height * dpr;
    var ctx = cnvs.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
}

var x1, x2;
if(document.documentElement.clientWidth > 1000){
    x1 = ~~(0.1 * document.documentElement.clientWidth / 2);
    x2 = ~~(0.9 * document.documentElement.clientWidth / 2);
}
else{
    x1 = ~~(0.1 * document.documentElement.clientWidth);
    x2 = ~~(0.9 * document.documentElement.clientWidth);
}

const y1 = 100;
const y2 = 180;
const force_y = 330;
const moment_y = 575;
const angdisp_y = 820;
const lindisp_y = 1065;
const indent = 5;
const line_width = 2;

class Balk{
    constructor(){
        this.cnvs = document.getElementById('cnvs');
        this.ctx = setupCanvas(this.cnvs);
    }
    base(y, width = line_width){
        this.draw_line(x1, y, x2, y, line_width);
        this.draw_node(x1);
        this.draw_node(x2);
    }
    dimensions(value){
        this.value = value;
        this.draw_line(x1 - indent, y2, x2 + indent, y2, 0.5);
    }
    draw_text(x2, x1, y, text, color = 'black', size = 14, align = 'center'){
        this.ctx.font = size.toString() + 'px Arial';
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;     
        this.ctx.fillText(text, (x2 + x1) / 2, y); 
    }
    draw_line(x1, y1, x2, y2, width, color = 'black'){
        this.ctx.beginPath(); 
        this.ctx.moveTo(x1, y1);
        this.ctx.lineWidth = width;
        this.ctx.lineTo(x2, y2);  
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
    draw_circle(x, y, R, start_angle = 0, finish_angle = 2 * Math.PI){
        this.ctx.beginPath();
        this.ctx.lineWidth = line_width;
        this.ctx.arc(x, y + R, R, start_angle, finish_angle);
        this.ctx.stroke();
    }
    draw_arrow(x1, y1, x2, y2, width = line_width, color = 'black') {
        let headlen = 9;
        let dx = x2 - x1;
        let dy = y2 - y1;
        let angle = Math.atan2(dy, dx);
        this.draw_line(x1, y1, x2, y2, width, color);
        this.ctx.beginPath();
        this.ctx.line_width = width;
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 8), y2 - headlen * Math.sin(angle - Math.PI / 8));
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 8), y2 - headlen * Math.sin(angle + Math.PI / 8));
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.stroke();
      }
    draw_node(x){
        this.draw_line(x, y2 + indent, x, y2 - 2 * indent, 0.5);
        this.draw_line(x + indent, y2 - indent, x - indent, y2 + indent, 0.5);
    }
    articulated_support(x, name = alphabet[0], type = 'fixed_support'){
        let R = 4;
        let len = 3.5 * R;
        let arrow_len = 55;
        this.draw_text(x, x + 24, y1 + 10, name, 'red', 10);
        this.draw_text(x, x + 24, y1 - arrow_len, 'R', 'red', 12);
        this.draw_text(x, x + 38, y1 - arrow_len + 3, name, 'red', 7);
        this.draw_circle(x, y1, R);
        this.draw_arrow(x, y1, x, y1 - arrow_len, line_width, 'red');
        if(type == 'mobile_support'){
            this.draw_line(x, y1 + R + R, x, y1 + 2 * len - 2 * R);
            this.draw_line(x - len - 2 * R, y1 + 2 * len, x + len + 2 * R, y1 + 2 * len);
            this.draw_circle(x, y1 + 2 * len - 2 * R, R);
        }
        else if(type == 'fixed_support'){
            this.draw_line(x + R / Math.sqrt(2), y1 + R + R / Math.sqrt(2), x + len, y1 + 2 * len);
            this.draw_line(x - R / Math.sqrt(2), y1 + R + R / Math.sqrt(2), x - len, y1 + 2 * len);
            this.draw_line(x - len - 2 * R, y1 + 2 * len, x + len + 2 * R, y1 + 2 * len);
        }
        for(var i = 1; i < (len - 1) / 2; i++){
            this.draw_line(x - len - 1.6 * R + 6 * i, y1 + 2 * len, x - len - 3 * R + 6 * i, y1 + 2 * len + 2 * R);
        }
    }
    distributed_load(coords_array, name = 1, direction = 'up', value = '0'){
        this.draw_line(coords_array[0] + x1, y1 - 34, coords_array[1] + x1, y1 - 34, 2);
        if(direction == 'up'){
            for(let i = coords_array[0]; i <= coords_array[1] + 1; i += (coords_array[1] - coords_array[0]) / Math.floor((coords_array[1] - coords_array[0]) / 25)){
                this.draw_arrow(i + x1, y1, i + x1, y1 - 35, 2);
            }
        }
        else if(direction == 'down'){
            for(let i = coords_array[0]; i <= coords_array[1] + 1; i += (coords_array[1] - coords_array[0]) / Math.floor((coords_array[1] - coords_array[0]) / 25)){
                this.draw_arrow(i + x1, y1 - 35, i + x1, y1, 2);
            }
        }
        this.draw_text(coords_array[1] + x1 + 6 - 7 * value.length / 2 - 3.5 * value.length, coords_array[0] + x1, y1 - 40, name, 'black', 8);
        this.draw_text(coords_array[1] + x1 - 5 - 7 * value.length / 2 - 3.5 * value.length, coords_array[0] + x1, y1 - 45, 'q', 'black', 12);
        this.draw_text(coords_array[1] + x1 + 16 + 7 * value.length / 2 - 3.5 * value.length, coords_array[0] + x1, y1 - 45, ' = ' + value, 'black', 12);
    }
    concentrated_force(x, name = 1, direction = 'up', value = '0'){
        this.draw_text(x, x + 27, y1 - 50, name, 'black', 8);
        this.draw_text(x, x + 17, y1 - 55, 'F', 'black', 12);
        this.draw_text(x, x + 40 + 7 * value.length, y1 - 55,  ' = ' + value, 'black', 12);
        if(direction == 'up'){
            this.draw_arrow(x, y1, x, y1 - 50, line_width);
        }
        else if(direction == 'down'){
            this.draw_arrow(x, y1 - 50, x, y1, line_width);
        }
    }
    moment(x, name = 1, direction = 'left', value = '0'){
        let R = 20;
        this.draw_circle(x, y1 - 40, 20, Math.PI + Math.PI / 6, - Math.PI / 6);
        if(direction == 'right'){
            this.draw_line(x + R * Math.cos(Math.PI - Math.PI / 6), y1 - 40 + R * Math.sin(Math.PI / 6), x, y1);
            this.draw_arrow(x - R * Math.cos(Math.PI - Math.PI / 3), y1 - 37, x - R * Math.cos(Math.PI + Math.PI / 6), y1 - 40 - R * Math.sin(- Math.PI / 6));
            this.draw_text(x - 7 * value.length, x + 40, y1 - 45, name, 'black', 8);
            this.draw_text(x - 7 * value.length, x + 25, y1 - 50, 'M', 'black', 12);
            this.draw_text(x, x + 50, y1 - 50, ' = ' + value, 'black', 12);
        }
        if(direction == 'left'){
            this.draw_line(x - R * Math.cos(Math.PI + Math.PI / 6), y1 - 40 - R * Math.sin(- Math.PI / 6), x, y1);
            this.draw_arrow(x + R * Math.cos(Math.PI + Math.PI / 3), y1 - 37, x + R * Math.cos(Math.PI - Math.PI / 6), y1 - 40 - R * Math.sin(- Math.PI / 6));
            this.draw_text(x, x - 40, y1 - 45, name, 'black', 8);
            this.draw_text(x, x - 55, y1 - 50, 'M', 'black', 12);
            this.draw_text(x, x - 25 + 7 * value.length, y1 - 50, ' = ' + value, 'black', 12);
        }
    }
}

var fixed_support = {
    class : 'fixed_support',
    name : 'Шарнирно-неподвижная опора',
    coords : [],
}
var mobile_support = {
    class : 'mobile_support',
    name : 'Шарнирно-подвижная опора',
    coords : [],
}
var support = {
    class : 'support',
    values : []
}
var force = {
    class : 'force',
    name : 'Сосредоточенная сила',
    coords : [],
    direction : [],
    values : []
}
var load = {
    class : 'load',
    name : 'Распределенная нагрузка',
    coords : [],
    direction : [],
    values : []
}
var moment = {
    class : 'moment',
    name : 'Момент',
    coords : [],
    direction : [],
    values : []
}

var balk = new Balk();
var force_direction = 'up';
var load_direction = 'up';
var moment_direction = 'left';
var x_coords = [];
var all_coords = []

function alphabet(element, item){
    support.coords = fixed_support.coords.concat(mobile_support.coords).sort(function(a, b) {return a - b});
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    for(let i = 0; i < support.coords.length; i++){
        if(support.coords[i] == element.coords[item]){
            return letters[i];
        }
    }
}

function get_value(id){
    return Number(document.getElementById(id).value);
}
function metrical(x){
    return x * get_value('len') / (x2 - x1);
}

function init(){
    x_coords = [0, x2 - x1];
    all_coords = [];
    support.coords = fixed_support.coords.concat(mobile_support.coords).sort(function(a,b) {return a[0] - b[0]});
    support.values = [];
    balk.ctx.clearRect(0 , 0, balk.cnvs.width, balk.cnvs.height);
    document.getElementById('support_len').setAttribute('max', get_value('len'));
    document.getElementById('force_len').setAttribute('max', get_value('len'));
    document.getElementById('load_start').setAttribute('max', get_value('len'));
    document.getElementById('load_finish').setAttribute('min', get_value('load_start'));
    document.getElementById('load_finish').setAttribute('max', get_value('len'));
    document.getElementById('moment_len').setAttribute('max', get_value('len'));
    document.getElementById('force_up').onclick = () => {
        force_direction = 'up';
        document.getElementById('force_up').style.opacity = '0.3';
        document.getElementById('force_down').style.opacity = '1';
    }
    document.getElementById('force_down').onclick = () => {
        force_direction = 'down';
        document.getElementById('force_down').style.opacity = '0.3';
        document.getElementById('force_up').style.opacity = '1';
    }
    document.getElementById('load_up').onclick = () => {
        load_direction = 'up';
        document.getElementById('load_up').style.opacity = '0.3';
        document.getElementById('load_down').style.opacity = '1';
    }
    document.getElementById('load_down').onclick = () => {
        load_direction = 'down';
        document.getElementById('load_down').style.opacity = '0.3';
        document.getElementById('load_up').style.opacity = '1';
    }
    document.getElementById('moment_right').onclick = () => {
        moment_direction = 'right';
        document.getElementById('moment_right').style.opacity = '0.3';
        document.getElementById('moment_left').style.opacity = '1';
    }
    document.getElementById('moment_left').onclick = () => {
        moment_direction = 'left';
        document.getElementById('moment_left').style.opacity = '0.3';
        document.getElementById('moment_right').style.opacity = '1';
    }

    balk.base(y1);
    balk.dimensions(len + ' (м)');
    for(let i = 0; i < document.getElementsByClassName('fixed_support').length; i++){
        value_text = '';
        balk.articulated_support(fixed_support.coords[i] + x1, alphabet(fixed_support, i), fixed_support.class);
        x_coords.push(fixed_support.coords[i]);
        all_coords.push([Number(fixed_support.coords[i]), support.class]);
    }
    for(let i = 0; i < document.getElementsByClassName('mobile_support').length; i++){
        balk.articulated_support(mobile_support.coords[i] + x1, alphabet(mobile_support, i), mobile_support.class);
        x_coords.push(mobile_support.coords[i]);
        all_coords.push([Number(mobile_support.coords[i]), support.class]);
    }
    for(let i = 0; i < document.getElementsByClassName('force').length; i++){
        balk.concentrated_force(force.coords[i] + x1, i + 1, force.direction[i], force.values[i].toString());
        x_coords.push(force.coords[i]);
        all_coords.push([Number(force.coords[i]), force.class]);
    }
    for(let i = 0; i < document.getElementsByClassName('load').length; i++){
        balk.distributed_load(load.coords[i], i + 1, load.direction[i], load.values[i].toString());
        x_coords.push(load.coords[i][0]);
        x_coords.push(load.coords[i][1]);
        all_coords.push([load.coords[i][0], load.coords[i][1], load.class]);
    }
    for(let i = 0; i < document.getElementsByClassName('moment').length; i++){
        balk.moment(moment.coords[i] + x1, i + 1, moment.direction[i], moment.values[i].toString());
        x_coords.push(moment.coords[i]);
        all_coords.push([Number(moment.coords[i]), moment.class]);
    }
    x_coords.sort(function(a, b) {return a - b});
    x_coords = [...new Set(x_coords)];
    all_coords.sort(function(a,b) {return a[0] - b[0]});
    get_support_values();
    force_diagram();
    moment_diagram();
    angular_displacements();
    linear_displacements();

    let distance = x1;
    for(i of x_coords){
        balk.draw_node(i + x1);
        balk.draw_line(i + x1, y2 + 50, i + x1, lindisp_y + 100, 0.5);
        if(i != 0){
            balk.draw_text(distance, i + x1, y2 - 6, (get_value('len') * (i - distance + x1) / (x2 - x1)).toFixed(2) + '(м)', 'black', 11);
        }
        distance = i + x1;
    }
}

function html(element){
    document.querySelectorAll('.' + element.class).forEach((a) => a.parentNode.remove());
    for(let i = 0; i < element.coords.length; i++){
        let html_p = document.createElement("p");
        let html_button = document.createElement("BUTTON");
        if(element.class == 'fixed_support' || element.class == 'mobile_support'){ 
            html_p.innerHTML = element.name + ' ' + alphabet(element, i) + ' ';
        }
        else{
            html_p.innerHTML = element.name + ' ' + (i + 1) + ' ';
        }
        html_button.innerHTML = 'x';
        html_button.setAttribute("class", element.class);
        html_button.setAttribute("value", i);
        html_p.setAttribute("class", 'element');
        document.getElementById('output').appendChild(html_p);
        html_p.appendChild(html_button);
    }
    init();
}

function add_element(element){
    document.getElementById(element.class).onclick = () => {
        if(get_value('len') > 0){
            if((element.class == 'fixed_support' || element.class == 'mobile_support') && get_value('support_len') <= get_value('len')){
                element.coords = element.coords.sort(function(a, b) {return a - b});
                if((fixed_support.coords.length + mobile_support.coords.length) < 2){
                    element.coords.push((get_value('support_len') * (x2 - x1) / get_value('len')));
                }
                else alert('Нельзя добавить опору. Балка будет статически неопределима!');
                html(fixed_support, fixed_support.coords[fixed_support.coords.length - 1]);
                html(mobile_support, mobile_support.coords[mobile_support.coords.length - 1]);
            }
            else if(element.class == 'force' && get_value('force_len') <= get_value('len')){
                element.coords.push((get_value('force_len') * (x2 - x1) / get_value('len')));
                if(force_direction == 'up'){
                    element.values.push(get_value('force_val'));
                }
                else{
                    element.values.push(-1 * get_value('force_val'));
                }
                element.direction.push(force_direction);
            }
            else if(element.class == 'load' &&  get_value('load_finish') > get_value('load_start') && get_value('load_finish') <= get_value('len')){
                element.coords.push([(get_value('load_start') * (x2 - x1) / get_value('len')), (get_value('load_finish') * (x2 - x1) / get_value('len'))]);
                if(load_direction == 'up'){
                    element.values.push(get_value('load_val'));
                }
                else{
                    element.values.push(-1 * get_value('load_val'));
                }
                element.direction.push(load_direction);
            }
            else if(element.class == 'moment' && get_value('moment_len') <= get_value('len')){
                element.coords.push((get_value('moment_len') * (x2 - x1) / get_value('len')));
                if(moment_direction == 'left'){
                    element.values.push(get_value('moment_val'));
                }
                else{
                    element.values.push(-1 * get_value('moment_val'));
                }
                element.direction.push(moment_direction);
            }
            if(new Set(element.coords).size !== element.coords.length || (Array.from(new Set(load.coords.map(JSON.stringify)), JSON.parse)).length !== load.coords.length){
                element.coords.pop();
                element.values.pop();
                element.direction.pop();
                alert('Элемент в указанной точке уже задан!');
            }
            html(element, element.coords[element.coords.length - 1]);
        }
    }
}

function remove_element(element){
    document.body.addEventListener('click', function(e){
        if(e.target && e.target.className == element.class){
            e.target.parentNode.remove();
            element.coords.splice(Number(e.target.value), 1);
            if(element.class == 'force' || element.class == 'load' || element.class == 'moment'){
                element.direction.splice(Number(e.target.value), 1);
                element.values.splice(Number(e.target.value), 1);
                html(element);
            }
            else{
                html(fixed_support, fixed_support.coords[fixed_support.coords.length - 1]);
                html(mobile_support, mobile_support.coords[mobile_support.coords.length - 1]);
            }
        }
    });
}

function get_force(F, x, relative){
    return F * (metrical(x) - metrical(relative));
}
function get_load(q, x, relative){
    return q * (metrical(x[1] - x[0])) * ((metrical(x[1] - x[0]) / 2 + metrical(x[0])) - metrical(relative));
}
function get_moment(M, x, relative){
    if(metrical(x) - metrical(relative) >= 0) return M
    else if(metrical(x) - metrical(relative) < 0) return -M
}

function support_calc(x, relative_coord){
    let support_value = 0;
    for(coord of force.coords){
        if(coord == x){
            support_value += get_force(force.values[force.coords.indexOf(coord)], coord, relative_coord);
        }
    }
    for(coord of load.coords){
        if(coord[0] == x){
            support_value += get_load(load.values[load.coords.indexOf(coord)], coord, relative_coord);
        }
    }
    for(coord of moment.coords){
        if(coord == x){
            support_value += moment.values[moment.coords.indexOf(coord)];
        }
    }
    return support_value;
}
function get_support_values(){
    let support_vals = [];
    for(support_coord of support.coords){
        let support_val = [];
        for(coord of x_coords){
            support_val.push(support_calc(coord, support_coord));
        }
        support_vals.push(support_val.reduce((a, b) => a + b, 0));
    }
    support.values.push(-support_vals[1] / metrical(support.coords[0] - support.coords[1]));
    support.values.push(-support_vals[0] / metrical(support.coords[1] - support.coords[0]));
}

function max(arr) {
    var len = arr.length, Max = -Infinity;
    while (len--) {
        if(Math.abs(arr[len]) > Max){
            Max = Math.abs(arr[len]);
            maxi = len;
        }
    }
    if(arr[maxi] >= 0) return Max;
    else return -Max;
}

function text_indent(arr, i){
    let val; let up_indent = 5; let down_indent = 15;
    if(i != x2 - x1){
        let xm_coords = x_coords.slice();
        if(!xm_coords.some(elem => elem == i)) xm_coords.push(i);
        xm_coords.sort(function(a, b) {return a - b});
        if(arr[~~i] >= 0 && (xm_coords[xm_coords.indexOf(i) + 1] - xm_coords[xm_coords.indexOf(i)]) < 8 * arr[~~i].toFixed(2).toString().length) up_indent = 18;
        if(arr[~~i] < 0 && (xm_coords[xm_coords.indexOf(i) + 1] - xm_coords[xm_coords.indexOf(i)]) < 8 * arr[~~i].toFixed(2).toString().length) down_indent = 32;
    }
    if(arr[~~i] >= 0 && i < x2 - x1 - 8 * arr[~~i].toFixed(2).toString().length){
        if(arr[~~i] >= arr[~~(i + 8 * arr[~~i].toFixed(2).toString().length)]){
            val = -up_indent;
        }
        else val = -(arr[~~(i + 8 * arr[~~i].toFixed(2).toString().length)] * 100 / Math.abs(max(arr)) - arr[~~i].toFixed(2) * 100 / Math.abs(max(arr))) - up_indent;
    }
    else if(arr[~~i] < 0 && i < x2 - x1 - 8 * arr[~~i].toFixed(2).toString().length){
        if(arr[~~i] >= arr[~~(i + 8 * arr[~~i].toFixed(2).toString().length)]){
            val = (arr[~~i].toFixed(2) * 100 / Math.abs(max(arr)) - arr[~~(i + 8 * arr[~~i].toFixed(2).toString().length)] * 100 / Math.abs(max(arr))) + down_indent;
        }
        else val = down_indent;
    }
    else if(i < x2 - x1 - 2){
        if(arr[~~i] > 0 ) val = -2 * (arr[~~i]).toFixed(2).toString().length - 5;
        else if(arr[~~i] <= 0) val = 2 * (arr[~~i]).toFixed(2).toString().length + 15;
    }
    else val = 0
    return val;
}

function force_diagram(){
    balk.base(force_y);
    x_forces = [];
    for(let i = 0; i <= x2 - x1; i++){
        let relative = 0;
        for(coord of x_coords){
            if(coord <= i) relative = coord;
        }
        let x_force = 0;
        for(coord of all_coords){
            if(coord[1] === 'support' && coord[0] <= relative && !isNaN(support.values[0]) && !isNaN(support.values[1])){
                x_force += support.values[support.coords.indexOf(coord[0])];
            }
            if(coord[1] === 'force' && coord[0] <= relative){
                x_force += force.values[force.coords.indexOf(coord[0])];
            }
            if(coord[2] === 'load' && i >= coord[0] && i <= coord[1]){
                x_force += load.values[load.coords.findIndex(arr => arr.includes(coord[1]))] * metrical(i - coord[0]);
            }
            if(coord[2] === 'load' && i > coord[1]){
                x_force += load.values[load.coords.findIndex(arr => arr.includes(coord[1]))] * (metrical(coord[1] - coord[0]));
            }
        }
        x_forces.push(x_force);
    }
    for(let i = 0; i < x2 - x1; i++){
        if(~~i % ~~((x2 - x1) / 50) == 0){
            balk.draw_line(i + x1, force_y, i + x1, force_y - Number(x_forces[i] * 100 / Math.abs(max(x_forces))), 0.5);
        }   
        balk.draw_circle(i + x1, force_y - Number(x_forces[i] * 100 / Math.abs(max(x_forces))), 0.4);
    }
    for(coord of x_coords){
        if(coord != x2 - x1){
            text = x_forces[~~coord].toFixed(2).toString();
            balk.draw_text(coord + x1, coord + x1 + 8 * text.length, force_y - Number(x_forces[~~coord] * 100 / Math.abs(max(x_forces))) + text_indent(x_forces, coord), text);
        } 
        else{
            text = x_forces[~~coord - 1].toFixed(2).toString();
            balk.draw_text(coord + x1, coord + x1 + 8 * text.length, force_y - Number(x_forces[~~coord - 1] * 100 / Math.abs(max(x_forces))) + text_indent(x_forces, coord), text);
        }
        if(coord > 0 && coord < x2 - x1 - 1){
            balk.draw_line(coord + x1 - 1, force_y - Number(x_forces[~~coord - 2] * 100 / Math.abs(max(x_forces))),
                coord + x1 - 1, force_y - Number(x_forces[~~coord + 2] * 100 / Math.abs(max(x_forces))), 2);
        }
    }
    balk.draw_text(x1 - 6, 0, force_y + 5, 'Q', 'black', 22);
    balk.draw_text(x1, 24, force_y + 10, 'y', 'black', 14);
}

function moment_diagram(){
    balk.base(moment_y);
    x_moments = [];
    for(let i = 0; i <= x2 - x1; i += 1){
        let relative = 0;
        for(coord of x_coords){
            if(coord <= i) relative = coord;
        }
        let x_moment = 0;
        for(coord of all_coords){
            if(coord[1] === 'support' && coord[0] <= relative && !isNaN(support.values[0]) && !isNaN(support.values[1])){
                x_moment += support.values[support.coords.indexOf(coord[0])] * metrical(i - coord[0]);
            }
            if(coord[1] === 'force' && coord[0] <= relative){
                x_moment += force.values[force.coords.indexOf(coord[0])] * metrical(i - coord[0]);
            }
            if(coord[1] === 'moment' && coord[0] <= relative && i >= coord[0]){
                x_moment -= moment.values[moment.coords.indexOf(coord[0])];
            }
            if(coord[2] === 'load' && i >= coord[0] && i <= coord[1]){
                x_moment += load.values[load.coords.findIndex(arr => arr.includes(coord[1]))] * metrical(i - coord[0]) * metrical(i - coord[0]) / 2;
            }
            if(coord[2] === 'load' && i > coord[1]){
                x_moment += load.values[load.coords.findIndex(arr => arr.includes(coord[1]))] * metrical(coord[1] - coord[0]) * ((metrical(coord[1] - coord[0]) / 2) + metrical(i - coord[1]));
            }
        }
        x_moments.push(x_moment);
    }
    for(let i = 0; i <= x2 - x1; i += 1){
        if(~~i % ~~((x2 - x1) / 50) == 0){
            balk.draw_line(i + x1, moment_y, i + x1, moment_y - Number(x_moments[i] * 100 / Math.abs(max(x_moments))), 0.5);
        }
        balk.draw_circle(i + x1, moment_y - Number(x_moments[i] * 100 / Math.abs(max(x_moments))), 0.4);
    }
    for(coord of x_coords){
        if(Math.abs((Number(x_moments[~~coord - 1] * 100 / Math.abs(max(x_moments)))) - Number(x_moments[~~coord + 1] * 100 / Math.abs(max(x_moments)))) < 8){
            text = (x_moments[~~coord]).toFixed(2).toString();
            balk.draw_text(coord + x1, coord + x1 + 8 * text.length, moment_y - Number(x_moments[~~coord + 1] * 100 / Math.abs(max(x_moments))) + text_indent(x_moments, coord + 1), text);
        }
        else if(coord !== x2 - x1 && coord !== 0){
            text = (x_moments[~~coord - 1]).toFixed(1).toString();
            balk.draw_text(coord + x1 - 8 * text.length, coord + x1, moment_y - Number(x_moments[~~coord - 8 * text.length] * 100 / Math.abs(max(x_moments))) + 
                text_indent(x_moments, coord - 8 * text.length - 10), text);
            text = (x_moments[~~coord + 1]).toFixed(1).toString();
            balk.draw_text(coord + x1, coord + x1 + 8 * text.length, moment_y - Number(x_moments[~~coord + 1] * 100 / Math.abs(max(x_moments))) + text_indent(x_moments, coord + 1), text);
        }
        if(coord === x2 - x1 || coord === 0){
            if(isFinite(moment.values[moment.coords.indexOf(coord)])) text = (x_moments[~~coord] + moment.values[moment.coords.indexOf(coord)]).toFixed(2).toString();
            else text = (x_moments[~~coord]).toFixed(2).toString();
            balk.draw_text(coord + x1, coord + x1 + 8 * text.length, moment_y - Number(x_moments[~~coord - 1] * 100 / Math.abs(max(x_moments))) + text_indent(x_moments, coord - 1), text);
        }
        if(coord === 0){
            text = (x_moments[~~coord]).toFixed(2).toString();
            balk.draw_text(coord + x1, coord + x1 + 8 * text.length, moment_y - Number(x_moments[~~coord] * 100 / Math.abs(max(x_moments))) + text_indent(x_moments, coord), text);
        }
        balk.draw_line(coord + x1, moment_y - Number(x_moments[~~coord - 1] * 100 / Math.abs(max(x_moments))), 
            coord + x1, moment_y - Number(x_moments[~~coord + 1] * 100 / Math.abs(max(x_moments))), 2);
    }
    if(Math.abs(max(x_moments)) > Math.abs(max(moment.values)) || moment.values.length == 0){
        if(x_moments.indexOf(max(x_moments)) == -1) Max = -max(x_moments);
        else Max = max(x_moments);
        for(coord of x_coords){
            let max_y;
            if(x_moments.indexOf(Max) == Math.round(coord)) break;
            else if(isFinite(Max)){
                text = Max.toFixed(2).toString();
                if(((~~x_moments.indexOf(Max) - 7 * text.length) < coord) && (coord < ~~x_moments.indexOf(Max))){
                    max_y = moment_y - Number(x_moments[~~x_moments.indexOf(Max)] * 100 / Math.abs(max(x_moments))) + 2.5 * text_indent(x_moments, x_moments.indexOf(Max)) - 6;
                }
                else if((coord > ~~x_moments.indexOf(Max))){
                    max_y = moment_y - Number(x_moments[~~x_moments.indexOf(Max)] * 100 / Math.abs(max(x_moments))) + text_indent(x_moments, x_moments.indexOf(Max));
                }
                balk.draw_line(x_moments.indexOf(Max) + x1, moment_y - 100 * Math.sign(Max), x_moments.indexOf(Max) + x1, force_y, 0.5);
                balk.draw_text(x_moments.indexOf(Max) + x1, x_moments.indexOf(Max) + x1 + 8 * text.length, max_y, text);
                if(isFinite(max_y)) break;
            }
        }
    }
    balk.draw_text(x1 - 6, 0, moment_y + 5, 'M', 'black', 22);
    balk.draw_text(x1, 24, moment_y + 10, 'z', 'black', 14);
}

function calc_displacements(i, type = 'lin', theta = 0, EIV0 = 0){
    let displacement; let k;
    factorial = [1, 2, 6, 24];
    if(type == 'lin'){
        k = 1;
        displacement = EIV0 + theta * metrical(i);
    } 
    else if(type == 'ang'){
        k = 0;
        displacement = theta;
    }
    let relative = 0;
    for(coord of x_coords){
        if(coord <= i) relative = coord;
    }
    for(coord of all_coords){
        if(coord[1] === 'support' && coord[0] <= relative && !isNaN(support.values[0]) && !isNaN(support.values[1])){
            displacement += support.values[support.coords.indexOf(coord[0])] * (Math.pow(metrical(i - coord[0]), k + 2) / factorial[k + 1]);
        }
        if(coord[1] === 'force' && coord[0] <= relative){
            displacement += force.values[force.coords.indexOf(coord[0])] * (Math.pow(metrical(i - coord[0]), k + 2) / factorial[k + 1]);
        }
        if(coord[2] === 'load' && coord[0] <= relative){
            displacement += load.values[load.coords.findIndex(arr => arr.includes(coord[1]))] * (Math.pow(metrical(i - coord[0]), k + 3) / factorial[k + 2]);
        }
        if(coord[2] === 'load' && i > coord[1]){
            displacement -= load.values[load.coords.findIndex(arr => arr.includes(coord[1]))] * (Math.pow(metrical(i - coord[1]), k + 3) / factorial[k + 2]);
        }
    }
    return displacement;
}
function angular_displacements(){
    balk.base(angdisp_y, line_width);
    angdisp = [];
    theta0 = -(calc_displacements(support.coords[1]) - calc_displacements(support.coords[0])) / (metrical(support.coords[1]) - metrical(support.coords[0]));
    for(let i = 0; i <= x2 - x1; i++){
        angdisp.push(Number(calc_displacements(i, 'ang', theta0)))
    }
    for(let i = 0; i <= x2 - x1; i++){
        if(~~i % ~~((x2 - x1) / 50) == 0){
            balk.draw_line(i + x1, angdisp_y, i + x1, angdisp_y - (angdisp[i] * 100 / Math.abs(max(angdisp))), 0.5);
        }
        balk.draw_circle(i + x1, angdisp_y - (angdisp[i] * 100 / Math.abs(max(angdisp))), 0.4);
    }
    for(coord of x_coords){
        if(coord != x2 - x1){
            text = (angdisp[~~coord] + ((angdisp[~~coord + 1] - angdisp[~~coord]) * (coord - ~~coord))).toFixed(2).toString();
        }
        else text = angdisp[~~coord].toFixed(2).toString();
        balk.draw_text(coord + x1, coord + x1 + 8 * text.length, angdisp_y - Number(angdisp[~~coord] * 100 / Math.abs(max(angdisp))) + text_indent(angdisp, coord), text);
    }
    balk.draw_text(x1 - 5, 8, angdisp_y + 5, 'EIθ', 'black', 22);
}

function linear_displacements(){
    balk.base(lindisp_y, line_width);
    lindisp = [];
    theta0 = -(calc_displacements(support.coords[1]) - calc_displacements(support.coords[0])) / (metrical(support.coords[1]) - metrical(support.coords[0]));
    EIV0 = -calc_displacements(support.coords[1]) - metrical(support.coords[1]) * theta0;
    for(let i = 0; i <= x2 - x1; i++){
        lindisp.push(Number(calc_displacements(i, 'lin', theta0, EIV0)));
    }
    for(let i = 0; i <= x2 - x1; i++){
        if(~~i % ~~((x2 - x1) / 50) == 0){
            balk.draw_line(i + x1, lindisp_y, i + x1, lindisp_y - (lindisp[i] * 100 / Math.abs(max(lindisp))), 0.5);
        }
        balk.draw_circle(i + x1, lindisp_y - (lindisp[i] * 100 / Math.abs(max(lindisp))), 0.4);
    }
    for(coord of x_coords){
        if(coord != x2 - x1){
            text = (lindisp[~~coord] + ((lindisp[~~coord + 1] - lindisp[~~coord]) * (coord - ~~coord))).toFixed(2).toString();
        }
        else text = lindisp[~~coord].toFixed(2).toString();
        balk.draw_text(coord + x1, coord + x1 + 8 * text.length, lindisp_y - Number(lindisp[~~coord] * 100 / Math.abs(max(lindisp))) + text_indent(lindisp, coord), text);
    }
    if(lindisp.indexOf(max(lindisp)) == -1) Max = -max(lindisp);
    else Max = max(lindisp);
    for(coord of x_coords){
        let max_y;
        if(lindisp.indexOf(Max) == coord) break;
        else if(isFinite(Max)){
            text = Max.toFixed(2).toString();
            if(((~~lindisp.indexOf(Max) - 7 * text.length) < coord) && (coord < ~~lindisp.indexOf(Max))){
                max_y = lindisp_y - Number(lindisp[~~lindisp.indexOf(Max)] * 100 / Math.abs(max(lindisp))) + 2.5 * text_indent(lindisp, lindisp.indexOf(Max)) - 6;
            }
            else if((coord > ~~lindisp.indexOf(Max))){
                max_y = lindisp_y - Number(lindisp[~~lindisp.indexOf(Max)] * 100 / Math.abs(max(lindisp))) + text_indent(lindisp, lindisp.indexOf(Max));
            }
            balk.draw_line(lindisp.indexOf(Max) + x1, lindisp_y - 100 * Math.sign(Max), lindisp.indexOf(Max) + x1, angdisp_y, 0.5);
            balk.draw_text(lindisp.indexOf(Max) + x1, lindisp.indexOf(Max) + x1 + 8 * text.length, max_y, text);
            if(isFinite(max_y)) break;
        }
    }
    balk.draw_text(x1 - 5, 8, lindisp_y + 5, 'EIV', 'black', 22);
}
document.getElementById('trash').onclick = () => {
    location.reload();
}
document.getElementById('download').onclick = () => {
    var canvas = document.getElementById("cnvs");
    var image = canvas.toDataURL();
    var link = document.createElement('a');
    link.download = 'balk_image.png';
    link.href = image;
    link.click();
}
document.getElementById('print').onclick = () => {
    document.getElementsByClassName('options')[0].style.display = 'none';
    document.getElementById('output').style.display = 'none';
    print();
    document.getElementsByClassName('options')[0].style.display = 'block';
    document.getElementById('output').style.display = 'block';
    init();
}

init();
len.oninput = () => init();
load_start.oninput = () => init();
add_element(fixed_support);
add_element(mobile_support);
add_element(force);
add_element(load);
add_element(moment);
remove_element(fixed_support);
remove_element(mobile_support);
remove_element(force);
remove_element(load);
remove_element(moment);