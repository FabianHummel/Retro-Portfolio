# Simple Entity Component System

For this game I needed a robust and simple entity component system
like the one from unity or unreal engine. I searched the internet
because I was not familiar enough with C++ to write one myself.

I didn't find anything that suited my needs and a few months later
I sat down and began to write my own. The result: 3 template
functions and a list of components.

## Add Component

The add component is probably the most significant in this ECS.
It first establishes the connection between the component and
its holder (parent).

Then, the component is being added to the list (std::vector) by
setting the key to the component ID, and the value to the component
itself.

```c++
template <typename T> Entity *addComponent(T *component)
{
	((Component *)component)->parent = this;
	this->components[typeid(*component).name()] = component;
	return this;
};
```

## Remove Component

To remove a component, simply pass the typeID to the
function, and the component will be erased from the list.

```c++
template <class T> Entity *removeComponent()
{
	components.erase(typeid(T).name());
	return this;
};
```

## Get Component

And lastly to get a component, also pass the typeID
to the function like in 'removeComponent' and it will
return the component.

```c++
template <class T> T *getComponent()
{
	return dynamic_cast<T*>(
    components[typeid(T).name()]
  );
};
```