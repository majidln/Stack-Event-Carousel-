import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, SafeAreaView, Animated } from 'react-native';

const { width, height } = Dimensions.get('screen');

const IMAGE_WIDTH = width * .8;
const IMAGE_HEIGHT = height * .7
const SPACING = 10;
const VISIBLE_ITEMS = 3;

const DATA = [
  {
    id: '1',
    image: require('./assets/1.jpg'),
    title: 'First Location'
  },
  {
    id: '2',
    image: require('./assets/2.jpg'),
    title: 'Second Location'
  },
  {
    id: '3',
    image: require('./assets/3.jpg'),
    title: 'Third Location'
  },
  {
    id: '4',
    image: require('./assets/4.jpg'),
    title: 'Fourth Location'
  },
  {
    id: '5',
    image: require('./assets/5.jpg'),
    title: 'Fifth Location'
  },
]

export default function App() {
  const scrollXIndex = React.useRef(new Animated.Value(0)).current;
  const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  }, [scrollXIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          padding: SPACING * 2,
          marginTop: 50,
        }}
        data={DATA}
        horizontal
        inverted={false}
        scrollEnabled={false}
        removeClippedSubviews={false}
        keyExtractor={(item) => item.id}
        CellRendererComponent={({
          item,
          index,
          children,
          style,
          ...props
        }) => {
          const newStyle = {...style, zIndex: DATA.length - index };
          console.log('render cell', index, newStyle)
          return (
            <View style={newStyle} index={index} {...props}>
              {children}
            </View>
          );
        }}
        renderItem={({ item, index }) => {
          const inputRange = [index - 1, index, index + 1];

          const translateX = scrollXAnimated.interpolate({
            inputRange,
            outputRange: [50, 0, -100],
          });

          const scale = scrollXAnimated.interpolate({
            inputRange,
            outputRange: [0.8, 1, 1.3],
          });

          const opacity = scrollXAnimated.interpolate({
            inputRange,
            outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
          });

          return (
            <Animated.View style={{...styles.itemWrapper, opacity, transform: [{ translateX }, {scale}] }}>
              <Image source={item.image}
                resizeMode="cover"
                style={styles.image}></Image>
              <Text style={styles.title}>{item.title}</Text>
            </Animated.View>
          )
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  itemWrapper: {
    position: 'absolute',
    left: -IMAGE_WIDTH / 2
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT
  },
  title: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#fff',
    fontSize: 22,
    fontWeight: '900'
  }
});
