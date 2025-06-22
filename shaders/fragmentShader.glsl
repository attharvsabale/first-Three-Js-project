precision mediump float;

varying float vElevation;

uniform float uColorChange;

void main(){
    vec4 c1 = vec4(1.0, 0.7255, 0.8157, 1.0); // Light pink
    vec4 c2 = vec4(1., .8235, .8824, 1.);    // White

    vec4 c3 = vec4(1.,.9216,.8588,1.);
    vec4 c4 = vec4(1.,.9686,.9451,1.);

    float blend = smoothstep(-.14, .14, vElevation);
    vec4 colorred = mix(c1, c2, blend);
    vec4 coloryellow = mix(c3,c4,blend);

    vec4 finalcolor = mix(colorred,coloryellow,uColorChange);
    gl_FragColor = finalcolor;
}
