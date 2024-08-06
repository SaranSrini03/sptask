import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SentimentGlobe = ({ sentiment, confidence }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: getSentimentColor(sentiment) });
    const sphere = new THREE.Mesh(geometry, material);
    
    scene.add(sphere);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, [sentiment, confidence]);

  const getSentimentColor = (sentiment) => {
    switch(sentiment.toLowerCase()) {
      case 'positive': return 0x4CAF50;
      case 'negative': return 0xF44336;
      default: return 0xFFC107;
    }
  };

  return <div ref={mountRef} />;
};

export default SentimentGlobe;