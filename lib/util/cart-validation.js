const { request } = require('graphql-request');
const { GRAPH_URL } = require('../../config');

export const validateItems = lineItems =>
  new Promise(async (resolve, reject) => {
    const uniqueLineItems = lineItems.reduce(
      (unique, val) =>
        unique.find(v => val.path === v.path) ? unique : [...unique, val],
      []
    );
    const queries = uniqueLineItems.map(
      (item, i) => `
        query PRODUCT_${i} {
          tree (language: "en", path: "${item.path}") {
            ... on Product {
              variants {
                id
                price
              }
            }
          }
        }
      `
    );
    const requests = queries.map(query => request(GRAPH_URL, query));
    let data;
    try {
      data = await Promise.all(requests);
      resolve(
        lineItems.map(item => {
          return data
            .map(({ tree }) => {
              const variant = tree[0].variants.find(v => v.id === item.id);
              if (!variant) return false;

              variant.quantity = item.quantity;
              return variant;
            })
            .filter(variant => variant)[0];
        })
      );
    } catch (error) {
      reject(error);
    }
  });
