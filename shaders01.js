var TestShader = `


  precision mediump float;

  uniform float data[4];
  uniform sampler2D data0;

  void main(void) {
      gl_FragColor = vec4(data[0], data[1], data[2], 1.0);
  }`;


var v_shader_tex = `#version 300 es
#define POSITION_LOCATION 0
#define TEXCOORD_LOCATION 4
#define COLOR_LOCATION 8
#define BUF_LOCATION 14

precision highp float;
precision highp int;

uniform mat4 mvp;
uniform float uTime;

layout(location = POSITION_LOCATION) in vec2 position;
layout(location = TEXCOORD_LOCATION) in vec2 textureCoordinates;
layout(location = COLOR_LOCATION) in vec3 color;
layout(location = BUF_LOCATION) in float dat;

out vec2 v_st;
out vec3 v_color;
out vec2 v_class;


void main()
{
  v_class = vec2(dat);
  vec2 displace = vec2 (0.0);//sin(uTime*(1.0+sin(position.y*position.x)))+0.1,sin(uTime+position.x)*0.1);
  v_st = textureCoordinates + displace;
  v_color = color;
  gl_Position = mvp * vec4(position + displace, 0.0, 1.0) ;
}`;

var f_shader_tex = `#version 300 es
#define FRAG_COLOR_LOCATION 0

precision highp float;
precision highp int;

uniform sampler2D texture0;
uniform sampler2D texture1;

uniform float lodBias;

in vec2 v_st;
in vec3 v_color;
in vec2 v_class;

layout(location = FRAG_COLOR_LOCATION) out vec4 color;

void main()
{
  color = texture(texture1, v_st, lodBias);
  if (v_class.x < 0.5) {
    color = vec4(1.0, 0.0, 0.0, 1.0) * texture(texture0, v_st, lodBias);
  }
  else {
    color = vec4(0.0, 1.0, 1.0, 1.0);
  }
  color = color * vec4(v_color, 1.0);
  color.xy = v_class;
}

`;


export {TestShader, v_shader_tex, f_shader_tex};
