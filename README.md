# BanditAPI
Bandit test support api.

Logics are from [Bandit Algorithms for Website Optimization](http://shop.oreilly.com/product/0636920027393.do)

## Supported Models

+ epsilon-greedy
+ softmax
+ ucb1

## Runs API

1. clone this repository
2. edit `config/default.json` or put your `NODE_ENV` config file (e.g. `config/production.json`)
3. `npm i`
4. `gulp server` or `gulp`

## Documents

### Endpoint base url

`yourhost:13579/` (13579 is default port)

### Request formats

+ All request should have `Content-type: application/json` header
+ All request parameters must embed on request body

### Response formats

+ All response has `200`(success) or `400`(fail) status
+ All response has json body

### Supported APIs

#### /create (POST)

Creates new bandit model.

##### request parameters

+ algorithm{string}: choose bandit algorithm name `epsilon_greedy`, `softmax`, `ucb_1`
+ arm_names{string[]}: name of arms. either this `arm_names` or `num_arms` required.
+ num_arms{number}: options count. either this `num_arms` or `arm_names` required. (1<=num_arms<=100)
+ settings{object}: algorithm depended settings
  + settings.epsilon{number}: epsilon-greedy only. (0<=epsilon<=1)
  + settings.tau{number}: softmax only. (0<=tau)

##### response

Response body contains created model. Your application must coordinate arm_ids and your options.

```
{
  "algorithm": "EpsilonGreedy",
  "model_id": "558d81548bacc82746f2ca6a",
  "arms": [
    {
      "name": "alice",
      "arm_id": "558d81548bacc82746f2ca6f",
      "value": 0
    },
    {
      "name": "bob",
      "arm_id": "558d81548bacc82746f2ca6e",
      "value": 0
    }
  ],
  "settings": {
    "epsilon": 0.4
  }
}
```

##### example

`$ curl -H "Content-type: application/json" -X POST -d '{"algorithm": "epsilon_greedy","arm_names":["alice", "bob"],"settings":{"epsilon":0.8}}' localhost:13579/create`

`$ curl -H "Content-type: application/json" -X POST -d '{"algorithm": "epsilon_greedy","num_arms":5,"settings":{"epsilon":0.8}}' localhost:13579/create`

#### /status (GET)

Get status of current bandit model.

##### request parameters

+ model_id{string}: your model's id returned from create api.

##### response

It is same format of create's response.

```
{
  "model_id": "558d81548bacc82746f2ca6a",
  "algorithm": "EpsilonGreedy",
  "arms": [
    {
      "name": "alice",
      "arm_id": "558d81548bacc82746f2ca6f",
      "value": 0
    },
    {
      "name": "bob",
      "arm_id": "558d81548bacc82746f2ca6e",
      "value": 1.388
    }
  ],
  "settings": {
    "epsilon": 0.4
  }
}
```

##### example

`$ curl -H "Content-type: application/json" -X GET -d '{"model_id":"558bae466b1296aa733176f6"}' localhost:13579/status`

#### /get (GET)

Get arm's id that your application should test.

##### request parameters

+ model_id{string}: your model's id returned from create api.

##### response

```
{
  "name": "alice",
  "arm_id": "558d81548bacc82746f2ca6f"
}

```

##### example

`$ curl -H "Content-type: application/json" -X GET -d '{"model_id":"558bae466b1296aa733176f6"}' localhost:13579/get`

#### /insert (POST)

Insert a test result to your bandit model.

##### request parameters

+ model_id{string}: your model's id returned from create api.
+ arm_id{string}: your application option's id returned from get api.
+ reward{number}: test result. `ucb_1` has a limitation `0 <= reward <= 1`.

##### response

Empty response.

```
{}
```

##### example

`$ curl -H "Content-type: application/json" -X POST -d '{"model_id":"558bae466b1296aa733176f6", "arm_id":"558bae466b1296aa733176f9","reward":3}' localhost:13579/insert`

#### /delete (DELETE)

Delete your bandit test model.

##### request parameters

+ model_id{string}: your model's id returned from create api.

##### response

Empty response.

```
{}
```

##### example

`$ curl -H "Content-type: application/json" -X DELETE -d '{"model_id":"558bae466b1296aa733176f6"}' localhost:13579/delete`


## TODOs

+ Add new algorithm: exp3
+ Add new api for arm maneuvering (add/delete/add name/update name)
+ Add request result field to response object
