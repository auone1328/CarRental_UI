import React, { useEffect } from 'react';

const MapViewer = ({ address }) => {
  useEffect(() => {
    if (!address || !window.ymaps) return;

    window.ymaps.ready(() => {
      // Создаем карту
      const map = new window.ymaps.Map('yandex-map', {
        center: [58.0104, 56.2294], // Координаты центра Перми
        zoom: 12
      });

      // Геокодирование адреса
      window.ymaps.geocode(address, {
        results: 1
      }).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        
        if (!firstGeoObject) {
          console.error('Адрес не найден');
          return;
        }

        // Добавляем маркер на карту
        map.geoObjects.add(firstGeoObject);
        
        // Масштабируем карту на найденный объект
        map.setBounds(firstGeoObject.properties.get('boundedBy'), {
          // Проверяем, чтобы zoom не был слишком большим для зданий
          checkZoomRange: true
        });

        // Добавляем балун с адресом
        firstGeoObject.properties.set({
          balloonContent: address
        });
      }).catch(err => {
        console.error('Ошибка геокодирования:', err);
      });
    });

    return () => {
      // Очистка при размонтировании
      const mapContainer = document.getElementById('yandex-map');
      if (mapContainer) mapContainer.innerHTML = '';
    };
  }, [address]);

  return (
    <div 
      id="yandex-map" 
      style={{ 
        margin: '20px',
        width: '37vw', 
        height: '400px',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }} 
    />
  );
};

export default MapViewer