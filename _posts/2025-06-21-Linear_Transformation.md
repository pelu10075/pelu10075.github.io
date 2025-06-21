---
layout: post
title: Linear Transformation
date: 2025-06-21 00:00:00
description: Functions that transform vectors and the idea of span
tags: LinearAlgebra EN
categories: Study
featured: false
chart:
  chartjs: true
---

## Linear Transformation — A Function That Changes Vectors

In the previous post, we talked about how matrices can transform vectors.

In this post, I will explain what “transformation” means and why it is called linear.

---

## What Is a Linear Transformation?

A linear transformation is a function that takes a vector as input and outputs another vector.  
But not just any vector transformation qualifies as a linear transformation. It must satisfy two conditions.

For a transformation T to be a linear transformation, for any vectors u, v and scalar (real number) c, the following must hold:

- Addition preservation: T(u + v) = T(u) + T(v)
- Scalar multiplication preservation: T(c · u) = c · T(u)

These two conditions mean "linearity".  
Simply put, adding vectors and then transforming must equal transforming them first and then adding.  
Similarly, multiplying a vector by a scalar and then transforming must equal transforming first and then scaling.

---

### Linear Transformation = Matrix Multiplication

A linear transformation can always be expressed as a matrix multiplication.  
That is, it can be written in the form T(x) = A·x, and the matrix A is the essence of the transformation.

Therefore, to properly understand linear transformations, you need to understand how matrix multiplication works.

---

### How to Compute Matrix Multiplication

Suppose matrix A is:

\[
A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}
\]

And vector x is:

\[
X = \begin{bmatrix} x \\ y \end{bmatrix}
\]

Then the product is:

\[
A×X = \begin{bmatrix} a·x + b·y \\ c·x + d·y \end{bmatrix}
\]

This computation is a core operation used constantly in computer graphics, physics simulation, and deep learning models.

---

### Geometric Meaning of Linear Transformation

Matrix A rotates, scales, shears, or flattens vectors.  
For example, the following matrix flattens all vectors onto the x-axis:

\[
A = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}
\]

Multiplying any vector results in a vector with a zero y-component. This means all vectors are flattened onto the x-axis.

In this way, a matrix acts on space and changes the region where vectors can lie.

---

## What Is Span?

The span of a set of vectors is the set of all their linear combinations.

This may be hard to understand, so for example, suppose we have the following two vectors:

```plotly
{
  "data": [
    {
      "type": "scatter",
      "mode": "lines+markers+text",
      "x": [0, 1],
      "y": [0, 0],
      "line": { "color": "red", "width": 3 },
      "marker": { "size": 6 },
      "text": ["", "v₁ = [1, 0]"],
      "textposition": "top right",
      "name": "v₁"
    },
    {
      "type": "scatter",
      "mode": "lines+markers+text",
      "x": [0, 0],
      "y": [0, 1],
      "line": { "color": "blue", "width": 3 },
      "marker": { "size": 6 },
      "text": ["", "v₂ = [0, 1]"],
      "textposition": "top left",
      "name": "v₂"
    }
  ],
  "layout": {
    "title": { "text": "Unit Vectors v₁ and v₂" },
    "xaxis": { "range": [-1, 2], "zeroline": true, "title": "x" },
    "yaxis": { "range": [-1, 2], "zeroline": true, "title": "y" },
    "showlegend": false,
    "width": 500,
    "height": 500
  }
}
```

The span of these two is the entire 2D plane. This is because any vector can be made by multiplying and adding v₁ and v₂ appropriately.

On the other hand, if you have two vectors lying in only one direction:

```plotly
{
  "data": [
    {
      "type": "scatter",
      "mode": "lines+markers+text",
      "x": [0, 1],
      "y": [0, 0],
      "line": { "color": "red", "width": 3 },
      "marker": { "size": 6 },
      "text": ["", "v₁ = [1, 0]"],
      "textposition": "top right",
      "name": "v₁"
    },
    {
      "type": "scatter",
      "mode": "lines+markers+text",
      "x": [0, 2],
      "y": [0, 0],
      "line": { "color": "blue", "width": 3 },
      "marker": { "size": 6 },
      "text": ["", "v₂ = [2, 0]"],
      "textposition": "bottom right",
      "name": "v₂"
    }
  ],
  "layout": {
    "title": { "text": "Vectors v₁ and v₂ on the Plane" },
    "xaxis": { "range": [-1, 3], "zeroline": true, "title": "x" },
    "yaxis": { "range": [-1, 1], "zeroline": true, "title": "y" },
    "showlegend": false
  }
}
```

Their span is only a single line along the x-axis. Vectors in the same direction can't create a wider space.

So, the span of a set of vectors is the set of all positions they can reach.
This concept is closely tied to linear independence, dimension, and basis.

This concept is closely tied to linear independence, dimension, and basis.

---

### Why Are Span and Linear Transformation Connected?

When computing A⋅x for a matrix A,
we are effectively sending the input vector into the span of the column vectors of A.

That is, the result of a matrix's linear transformation always lies in the span of its column vectors.
This fact is key to understanding solution sets of linear equations, bases, null spaces, etc.

---

## Summary

- A linear transformation preserves addition and scalar multiplication, and can always be written as a matrix product.

- Matrix multiplication rotates, transforms, scales, and projects space.

- Span is the set of all linear combinations that a set of vectors can produce.

- The result of a linear transformation always lies within the span of the matrix’s column vectors.

---

I created several examples to talk about linear transformations, but due to the nature of blogs, it was hard to show examples of linear transformations being applied.
I believe watching 3b1b’s videos will help with intuitive understanding.
In the next post, I will discuss eigenvalues and eigenvectors, which are important concepts in linear transformations.
Some vectors do not change direction under linear transformation — only their size changes.
We’ll look into what those vectors are and why they matter.
