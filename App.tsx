import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, SafeAreaView, Animated, Alert } from 'react-native';
import { Directions, FlingGestureHandler, State } from 'react-native-gesture-handler'

const { width, height } = Dimensions.get('screen');

const IMAGE_WIDTH = width * .8;
const IMAGE_HEIGHT = height * .7
const SPACING = 10;
const VISIBLE_ITEMS = 3;

const DATA = [
  {
    id: '1',
    image: require('./assets/1.jpg'),
    title: 'First Location',
    location: "Dubai",
  },
  {
    id: '2',
    image: require('./assets/2.jpg'),
    title: 'Second Location',
    location: "New York",
  },
  {
    id: '3',
    image: require('./assets/3.jpg'),
    title: 'Third Location',
    location: "Tehran",
  },
  {
    id: '4',
    image: require('./assets/4.jpg'),
    title: 'Fourth Location',
    location: "London",
  },
  {
    id: '5',
    image: require('./assets/5.jpg'),
    title: 'Fifth Location',
    location: "Helsinki",
  },
]

const HeaderBar = ({ scrollXAnimated }) => {
  return (
    <FlatList data={DATA}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => {
        return <Animated.View style={styles.headerItemWrapper}>
          <Text style={styles.headerItemTitle}>
            {item.title}
          </Text>
        </Animated.View>
      }}
    />
  )
}

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

  const indexChanged = (newIndex: number) => {
    setIndex(newIndex);
    scrollXIndex.setValue(newIndex)
  }

  return (
    <FlingGestureHandler direction={Directions.LEFT}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
          if (index < DATA.length - 1) {
            indexChanged(index + 1)
          }
        }
      }}>
      <FlingGestureHandler direction={Directions.RIGHT}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            if (index > 0) {
              indexChanged(index - 1)
            }
          }
        }}>
        <SafeAreaView style={styles.container}>
          <HeaderBar scrollXAnimated={scrollXAnimated} />
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
              const newStyle = { ...style, zIndex: DATA.length - index };
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
                <Animated.View style={{ ...styles.itemWrapper, opacity, transform: [{ translateX }, { scale }] }}>
                  <Image source={item.image}
                    resizeMode="cover"
                    style={styles.image} />
                  <Text style={styles.title}>{item.title}</Text>
                </Animated.View>
              )
            }}
          />
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
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
    height: IMAGE_HEIGHT,
    borderRadius: 12
  },
  title: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#fff',
    fontSize: 22,
    fontWeight: '900'
  },
  listContainer: {
    backgroundColor: 'blue', position: 'absolute', top: 40,
    left: 20,
  },
  headerItemWrapper: {
    width,

    backgroundColor: 'red'
  },
  headerItemTitle: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '900'
  }
});
