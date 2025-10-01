import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/categoryData';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Star, MapPin, Clock, BadgeCheck } from 'lucide-react';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const allProducts = getAllProducts();
  console.log('All product IDs:', allProducts.map(p => p.id)); // Debug log
  return allProducts.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const allProducts = getAllProducts();
  const product = allProducts.find((prod) => prod.id === params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} - SIBN Ecommerce`,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const allProducts = getAllProducts();
  const product = allProducts.find((prod) => prod.id === params.id);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  1 of {product.images.length}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isFeatured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  Featured
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0">
                  New
                </Badge>
              )}
              <Badge variant="secondary" className="capitalize">
                {product.condition}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="destructive">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <AddToCartButton 
                product={product} 
                size="lg" 
                showQuantity={true}
                className="flex-1"
              />
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Seller Info */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {product.seller.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{product.seller.name}</span>
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.seller.rating}/5</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Contact Seller</Button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-600">Category</dt>
                  <dd className="font-medium">{product.category.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Condition</dt>
                  <dd className="font-medium capitalize">{product.condition}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Location</dt>
                  <dd className="font-medium">{product.location}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Posted</dt>
                  <dd className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}