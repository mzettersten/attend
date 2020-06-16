/**
 * jspsych-attend-trigger
* Martin Zettersten 
* adapted  from
* jspsych-image-button-response
 * Josh de Leeuw
 *
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["attend-trigger"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('attend-trigger', 'target_image', 'image');

  plugin.info = {
    name: 'attend-trigger',
    description: '',
    parameters: {
        target_image: {
          type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'stimulus trigger',
          default: "stims/penguin.png",
          array: false,
          description: 'Image to click to advance.'
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
          default: [150,150],
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
	  
    // display stimulus
	  var target_image = paper.image(trial.target_image, 425, 225, trial.image_size[0],trial.image_size[1]);


    // start timing
    var start_time = performance.now();
	
    // store response
    var response = {
      rt: null,
      button: null
    };
	
	//add click trigger
    target_image.click(function() {
		this.unclick();
       var end_time = (new Date()).getTime();
       response.rt = end_time - start_time;
	  
	   after_response("penguin");
	   
    });

    

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;
	  
  	target_image.animate({
  			y: "25",
		width: 100,
		height: 100
  		},300,mina.easeinout);

      if (trial.response_ends_trial) {
		  end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
		  "rt": response.rt,
		  "button_pressed": response.button
      };
	  
	
	  
	  setTimeout(function(){
	      // clear the display
	      display_element.innerHTML = '';

	      // move on to the next trial
	      jsPsych.finishTrial(trial_data);
	},500);

      
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
