/**
 * jspsych-attend
* Martin Zettersten 
* adapted  from
* jspsych-image-button-response
 * Josh de Leeuw
 *
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["attend"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('attend', 'stimuli', 'image');

  plugin.info = {
    name: 'attend',
    description: '',
    parameters: {
        stimuli: {
          type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimuli',
          default: undefined,
          array: true,
          description: 'The images to be displayed.'
        },
        canvas_size: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Canvas size',
          array: true,
          default: [1000,800],
          description: 'Array specifying the width and height of the area that the animation will display in.'
        },
        image_size: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Image size',
          array: true,
          default: [200,200],
          description: 'Array specifying the width and height of the images to show.'
        },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_contingent_color: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response leads to contingent color response',
        default: false,
        description: 'If true, then circle will change color when user responds.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
	  
	  // create canvas
      html = "<svg id='jspsych-attend-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>";
	  
	  //show prompt if there is one
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
	  
      display_element.innerHTML = html;
	  
      var paper = Snap("#jspsych-attend-canvas");
	  
	  var circle1 = paper.circle(175, 300, 150);
	  circle1.attr({
		  fill: "#98F5FF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle2 = paper.circle(825, 300, 150);
	  circle2.attr({
		  fill: "#98F5FF",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  
	  
	  
	  var imageLocations = [
	    [75, 200],
	    [725, 200]
	  ];
	  
    // display stimulus
	  var target_image = paper.image("stims/penguin.png", 425, 25, 100,100);
	  
	  var image_1 = paper.image(trial.stimuli[0], imageLocations[0][0], imageLocations[0][1], trial.image_size[0],trial.image_size[1]);
	  var image_2 = paper.image(trial.stimuli[1], imageLocations[1][0], imageLocations[1][1], trial.image_size[0],trial.image_size[1]);
	  image_1.attr({
		  opacity: "0"
	  });
	  image_2.attr({
		  opacity: "0"
	  });
  	image_1.animate({
  			opacity: "1"
  		},150);

  	image_2.animate({
  			opacity: "1"
  		},150);
		
	  var touchCircle1 = paper.circle(175, 300, 150);
	  touchCircle1.attr({
		  fill: "#98F5FF",
		  stroke: "#000",
		  strokeWidth: 5,
		  opacity: 0
	  });
	  var touchCircle2 = paper.circle(675, 300, 150);
	  touchCircle2.attr({
		  fill: "#98F5FF",
		  stroke: "#000",
		  strokeWidth: 5,
		  opacity: 0
	  });


    // start timing
    var start_time = performance.now();
	
    // store response
    var response = {
      rt: null,
      button: null
    };
	
	//add click option
    touchCircle1.click(function() {
		this.unclick();
       var end_time = (new Date()).getTime();
       response.rt = end_time - start_time;
	if (trial.response_contingent_color) {

  	  circle1.animate({
  		  fill: "#006400"
  	  },150,mina.linear);
	};
	  
	   after_response(0);
    });
	
    touchCircle2.click(function() {
		this.unclick();
		
		if (trial.response_contingent_color) {

	  	  circle2.animate({
	  		  fill: "#006400"
	  	  },150,mina.linear);
		};
	  
	   after_response(1);
    });

    

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      if (trial.response_ends_trial) {
		  setTimeout(function(){
			  end_trial();
			  },150);
      }
    };

    // function to end trial when it is time
    function end_trial() {
		touchCircle1.unclick()
		touchCircle2.unclick()

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
		  "stimulus_1":  trial.stimuli[0],
		  "stimulus_2":  trial.stimuli[1],
		  "rt": response.rt,
		  "button_pressed": response.button,
		  "stimulus_selected": trial.stimuli[response.button]
      };
	  
	image_1.animate({
			opacity: "0"
		},150);

	image_2.animate({
			opacity: "0"
		},150);
	  
	  setTimeout(function(){
	      // clear the display
	      display_element.innerHTML = '';

	      // move on to the next trial
	      jsPsych.finishTrial(trial_data);
	},150);

      
    };


    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
