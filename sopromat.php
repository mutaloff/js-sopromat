<?php
	session_start();
	$disclaimer = 'disclaimer';
	if(!isset($_COOKIE[$disclaimer])) {
		$show_disclaimer = '1';
	}
	if(isset($_POST['accept'])){
		$show_disclaimer = '0';
		setcookie($disclaimer, $show_disclaimer, time() + (7 * 86400));
		header('Location: http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']); 
		exit;
	}
	$string = file_get_contents("./aero_alloys.json");
	$json = json_decode($string, true);
	$material_name = array();
	$material_value = array();
	foreach ($json["alloys"] as $item){
		array_push($material_name, $item["Сплав"]);
		array_push($material_value, $item["Е(ГПа)"]);
	}
	function get($column, $profile_type){
		$conn = mysqli_connect('csdeml.ugatu.su', 'sts07', 'sts407-077', 'sts07-13671');;
		if(mysqli_connect_errno())
		{
			echo 'Ошибка';
			exit();
		}
		if($profile_type == 'beam'){
			$sql = mysqli_query($conn, 'SELECT '.$column.' FROM `8239` ');
		}
		if($profile_type == 'channel'){
			$sql = mysqli_query($conn, 'SELECT '.$column.' FROM `8240` ');
		}
		$result = mysqli_fetch_all($sql, MYSQLI_ASSOC);
		$conn->close();
		return $result;
	}
?>
<!DOCTYPE html>
<html>
	<head lang = "en">
        <meta charset = "UCF-8">
		<title>Сопромат</title>
		<link rel = "shortcut icon" href="./ico.png" type="image/png">
        <link rel = "stylesheet" href = "./sopromat.css">
	</head>
	<body style = 'margin: 0px;'>
		<div class = 'nav'>
			<div class = 'options'>		
				<div class='balk_len'>
					<h3>Длина:</h3>
					<p>Полная длина балки (м): <input type="number" min="0" id ='len'></p>
				</div>
				<div class='balk_support'>
					<h3>Опора:</h3>
					<p>Расстояние (м): <input type="number" min="0" id='support_len'></p>
					<img src="./fixed_support.png" height='40' id='fixed_support'>
					<img src="./mobile_support.png" height='40' id='mobile_support'>
				</div>
				<div class='balk_force'>
					<h3>Сосредоточенная сила:</h3>
					<p>Расстояние (м):<input type="number" min="0" id='force_len'></p>
					<p>Величина силы (кН):<input type="number" id='force_val'></p>
					<div class='put_arrows'>
						<img src="./force.png" height='40' id='force'>
						<button id = 'force_up'>↑</button>
						<button id = 'force_down'>↓</button>
					</div>
				</div>
				<div class='balk_load'>
					<h3>Распределенная нагрузка:</h3>
					<p>Начальная точка: <input type="number" min="0" id='load_start'></p>
					<p>Конечная точка: <input type="number" min="0" id='load_finish'></p>
					<p>Величина нагрузки (кН/м):<input type="number" id='load_val'></p>
					<div class='put_arrows'>
						<img src="./load.png" height = '40' id='load'>
						<button id = 'load_up'>↑</button>
						<button id = 'load_down'>↓</button>
					</div>
				</div>
				<div class='balk_moment'>
					<h3>Момент:</h3>
					<p>Расстояние: <input type="number" min="0" id='moment_len'></p>
					<p>Величина момента (кН*м):<input type="number" id='moment_val'></p>
					<div class='put_arrows'>
						<img src="./moment.png" height='40' id='moment'>
						<button id = 'moment_right'>⟳</button>
						<button id = 'moment_left'>⟲</button>
					</div>
				</div>
				<div class='balk_design'>
					<h3>Конструктивные характеристики:</h3>
					<p>Расчетное сопротивление материала на изгиб (МПа): <input type="number" min="0" id='bend_resistance'></p>
					<p>Расчетное сопротивление материала на срез (МПа): <input type="number" min="0" id='slice_resistance'></p>
					<p>Модуль упругости материала (ГПа):<input type="number" id='elastic_modulus'></p>
					<div class="dropdown">
						<button onclick="show_materials()" id="drop_button">Выбрать материал ▼</button>
						<div id="content">
							<input type="text" placeholder="Поиск.." id="search_list" onkeyup="filter_materals()">	
						</div>
					</div>
					<p>Соотношение сторон h:b для прямоугольного сечения:<input type="number" id='hb_ratio'></p>
					<p>Нормативный прогиб (м):<input type="number" id='standard_deflection'></p>
					<img src="./i-beam.png" height='40' id='i-beam'>
					<img src="./channel1.png" height='40' id='channel1'>
					<img src="./channel2.png" height='40' id='channel2'>
					<img src="./rectangle.png" height='40' id='rectangle'>
				</div>
				<div class='img'>
					<h3>Изображение:</h3>
					<img src="./clear_cnvs.png" height='40' id='trash'>
					<img src="./download_cnvs.png" height='40' id='download'>
					<img src="./print_cnvs.png" height='40' id='print'>
				</div>
				<div class='directory'>
					<h3>Справочник:</h3>
						<a href='https://docs.cntd.ru/document/1200004409'> https://docs.cntd.ru/document/1200004409</a>
						<br><a href='https://docs.cntd.ru/document/1200001022'> https://docs.cntd.ru/document/1200001022</a>
				</div>
			</div>
			<div class = main>
				<h3 id = 'app-name'>Расчеты на прочность и жесткость при изгибе</h3>
				<canvas id = 'cnvs'>
					<div id = 'diagram'></div>
				</canvas>
			</div>
			<div id='output'>
			</div>
		</div>
		<div id = 'disclaimer'>
    		<p>
			1. Размещаемая на странице информация предназначена для свободного ознакомления пользователей с вопросами, которые могут представлять для них интерес.
			<br>2. Вся информация предоставляется в исходном виде, без гарантий полноты или своевременности, и без иных явно выраженных или подразумеваемых гарантий. 
			Доступ к Сайту, а также использование его Содержимого осуществляются исключительно по вашему усмотрению и на ваш риск.
			<br>3. Автор не дает каких-либо заверений или гарантий в отношении Сайта и его Содержимого, в том числе, без ограничения, в отношении своевременности, 
			актуальности, точности, полноты, достоверности, доступности или соответствия для какой-либо конкретной цели Сайта и Содержимого, в отношении того, 
			что при использовании Сайта не возникнет ошибок, оно будет безопасным и бесперебойным, что Автор будет исправлять какие-либо ошибки, 
			или что Сайт не нарушают прав третьих лиц.
			<br>4. Сайт может использовать идентификационные файлы cookies для хранения как вашей личной, так и общей информации. 
			«Cookies» представляют собой небольшие текстовые файлы, которые могут использоваться интернет-сайтом для опознавания повторных посетителей, 
			упрощения доступа и использования посетителем сайта, а также отслеживания сайтом обращений посетителей и сбора общей информации для улучшения содержания. 
			Пользуясь Сайтом, вы выражаете свое согласие на использование Сайтом cookies.
			<br>5. Автор оставляет за собой право вносить изменения без уведомления о них пользователей. Также Администрация не несет ответственности за изменение, 
			редактирование или удаление любой информации, добавленной вами на Сайт или другие связанные с ним проекты.
			<br>6. Автор вправе отказать в доступе к Сайту любому Пользователю, или группе Пользователей без объяснения причин своих действий и предварительного 
			уведомления.
			<br>7. Любые торговые марки, знаки и названия товаров, служб и организаций, права на дизайн, авторские и смежные права, которые упоминаются, 
			используются или цитируются на сайте, принадлежат их законным владельцам и их использование здесь не дает вам право на любое другое использование.
			<br>8. Чтение, распространение или изменение информации, размещённой на данном сайте, может являться нарушением законов той страны, 
			в которой вы просматриваете этот сайт.
			<br>9. Пользователь соглашается с тем, что нормы и законы о защите прав потребителей не могут быть применимы к использованию им Сайта, 
			поскольку он не оказывает возмездных услуг.
			<br>10. Если в соответствии с действующими законами какие-либо условия будут признаны недействительными, остальные условия остаются в полной силе.
			Используя данный Сайт, Вы и все пользователи вашего устройства выражаете свое согласие с "Отказом от ответственности" и 
			установленными Правилами и принимаете всю ответственность, которая может быть на Вас возложена.
			<br>Автор Сайта в любое время вправе внести изменения в Правила, которые вступают в силу немедленно. Продолжение пользования Сайтом после 
			внесения изменений означает Ваше автоматическое согласие на соблюдение новых правил.
			</p>
			<form method="POST">
				<input type="submit" id='accept' value="Принять" name='accept'>
			</form>
		</div>
		<center style='margin:10px'>
            © Муталов Тимур Рустемович, 2021.
        </center>
	</body>
	<script> var show_disclaimer = Number(<?php echo $show_disclaimer; ?>);</script>

	<script> var material_names = <?php echo json_encode($material_name); ?>;</script>
	<script> var material_values = <?php echo json_encode($material_value); ?>;</script>

	<script> var inertia_moment_b = <?php echo json_encode(get('I', 'beam')); ?>;</script>
	<script> var resistance_moment_b = <?php echo json_encode(get('W', 'beam')); ?>;</script>
	<script> var sectional_area_b = <?php echo json_encode(get('A', 'beam')); ?>;</script>
	<script> var square_b = <?php echo json_encode(get('S', 'beam')); ?>;</script>
	<script> var wall_thickness_b = <?php echo json_encode(get('b', 'beam')); ?>;</script>
	<script> var number_b = <?php echo json_encode(get('Number', 'beam')); ?>;</script>

	<script> var inertia_moment_c = <?php echo json_encode(get('I', 'channel')); ?>;</script>
	<script> var resistance_moment_c = <?php echo json_encode(get('W', 'channel')); ?>;</script>
	<script> var sectional_area_c = <?php echo json_encode(get('A', 'channel')); ?>;</script>
	<script> var square_c = <?php echo json_encode(get('S', 'channel')); ?>;</script>
	<script> var wall_thickness_c = <?php echo json_encode(get('b', 'channel')); ?>;</script>
	<script> var number_c = <?php echo json_encode(get('Number', 'channel')); ?>;</script>
	<script charset="utf-8" type="text/javascript" SRC="./sopromat.js"></script>
	<script charset="utf-8" type="text/javascript" SRC="./design_characteristics.js"></script>
</html>
